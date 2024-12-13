const express = require('express');
const path = require('path');
const contentService = require("./content-service");
require('dotenv').config();

const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 9090; // assign a port

// Set EJS as the view engine
// app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Serve static files from the public director
app.use(express.static(path.join(__dirname, "public")));

// start the server on the port and output a confirmation to the console
contentService
  .initialize() // load data into articles.json and categories.json
  .then(() => {
    app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`));
   
  })
  .catch((err) => {
    console.log("Unable to start server: " + err);
  });



//Redirect the home page to the about page url
app.get('/', (req, res) => {
  //redirect to about
    res.redirect("/about");
  });


app.get('/about', (req, res) => {
  res.render('about'); // Render the about.ejs file

});

/**
 * Articles
 */
app.get('/articles', (req, res) => {
  //Get Category and MinDate from the request query
  const { category, minDate } = req.query;

  if (category) {
    contentService.getArticlesByCategory(category)
        .then(
          (filteredArticles) => res.render('articles', { articles: filteredArticles })
        )     
        .catch((err)=>{
          res.render('articles', { articles: [] });
        })
  }
  else if (minDate) {
    contentService.getArticlesByMinDate(minDate)
    .then((filteredArticles) => res.render('articles', { articles: filteredArticles }))
    .catch((err) => res.render('articles', { articles: [] }));
}

  //when there are no filters, get all articles
  else{
    contentService.getAllArticles()
    .then((articles) => res.render('articles', { articles }))
    .catch((err) => res.render('articles', { articles: [] }));
  }
  
});

/**
 * Get an Article by ID
 */
app.get("/article/:id", (req, res) => {
  contentService
    .getArticleById(req.params.id)
    .then((article) => {
      res.render("article", {article: article});
    })
    .catch((err) => {
      res.render("articles", {articles: []});
    });
});


/** 
 * Add Article
**/
app.get('/articles/add', (req, res) => {
  contentService.getCategories()
  .then((categories) => {
    // Render the addArticle.ejs with categories
    res.render('addArticle', { categories: categories });
  })
  .catch((err) => {
    // Render the addArticle.ejs file with empty categories
    res.render('addArticle', { categories: [] });
  });
});



app.get('/categories', (req, res) => {
  contentService.getCategories()
  .then((categories) => {
    // res.json(categories);
    res.render("categories", {categories: categories});
  })
  .catch((err)=>{
    res.render("categories", {categories: []});
  })
  
});





/**
 * Publish an Article
*/

//Cloudinary Config
const multer = require("multer"); 
const cloudinary = require('cloudinary').v2; 
const streamifier = require('streamifier'); 

cloudinary.config({ 
   cloud_name: process.env.CD_NAME , 
   api_key:  process.env.CD_KEY,
   api_secret: process.env.CD_SECRET,
   secure:  process.env.CD_SECURE
}); 

const upload = multer(); // No disk storage, files are stored in memory 

// Route to handle a new article upload with an optional feature image
app.post("/articles/add", upload.single("featureImage"), (req, res) => {
   // Check if a  file is uploaded, and upload to Cloudinary
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        // Create an upload stream
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

         // Make use of  streamifier to create a read stream from the uploaded file's buffer
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      try {
         // Asynchronously upload the file and await the result
         let result = await streamUpload(req);
         console.log(result); // Log the result for debugging
         return result;
      } catch (error) {
         console.error("Error during file upload:", error);
         throw error;
      }
   }

    // after upload is done, process the item with the image link
    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    // If there is no file uploaded, continue with an empty image link
    processItem("");
  }

 //This function process the article data and store it
  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;
    contentService
      .addArticle(req.body)
      .then(() => {
        contentService.initialize()
        .then(()=>{
          res.redirect("/articles");
        })
        .catch((err)=>{
          console.log("Unable to start server: " + err);
        })
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  }
});