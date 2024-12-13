const fs = require('fs');
const path = require('path');

var articles = [];
var categories = [];
    
// Initialize to read articles.json and categories.json
const initialize = () =>{
    return new Promise((resolve, reject) => {
        const articlesPath = path.join(__dirname, 'data', 'articles.json');
        const categoriesPath = path.join(__dirname, 'data', 'categories.json');

        // Read articles.json 
        fs.readFile(articlesPath, 'utf8', (err, articlesData) => {
            if (err) {
                reject("unable to read articles file");
                return;
            }   

            // Parse articles.json 
            try {
                articles = JSON.parse(articlesData);
            } catch (parseErr) {
                reject("unable to parse articles file");
                return;
            }


            // Read categories.json 
            fs.readFile(categoriesPath, 'utf8', (err, categoriesData) => {
                if (err) {
                    reject("unable to read categories file");
                    return;
                }
            
                // Parse categories.json 
                try {
                    categories = JSON.parse(categoriesData);
                    
                    // Merge category names into articles
                    articles = articles.map(article => {
                        const category = categories.find(cat => cat.id == article.category);
                        return {
                        ...article,
                        categoryName: category ? category.name : "Unknown",
                        };
                    });
                    resolve("Data loaded successfully");
                } catch (parseErr) {
                    reject("unable to parse categories file");
                }
            });
        });
    });

}

//Get Publsihed Articles
const getPublishedArticles = () => {
    return new Promise((resolve, reject) => {
        const publishedArticles =  articles.filter(article => article.published);
        if (publishedArticles.length > 0) {
            resolve(publishedArticles);
        } else {
            reject("no results returned");
        }
    });
}

//Get All Articles
const getAllArticles = () => {
    return new Promise((resolve, reject)=>{
        if(articles.length > 0){
            resolve(articles);
        }else{
            reject("no results returned");
        }
    });
}

//Get All Catgories
const getCategories = () => {
    return new Promise((resolve, reject)=>{
        if(categories.length > 0){
            resolve(categories);
        }else{
            reject("no results returned");
        }
    });
}

//Add a article
const addArticle = (articleData) => { 
    return new Promise((resolve, reject) => { 
        if(articleData){
            articleData.published = articleData.published ? true : false; 
            articleData.id = articles.length + 1; // Set ID to the current length + 1 
            articles.push(articleData); 
            resolve(articleData); 
        }else{
            reject("There is no article data to add");
        }
    
    }); 
    
    }; 

//Get articles by catgeory
const getArticlesByCategory = (category) => {
    return new Promise((resolve, reject) => { 
        const filteredArticles= articles.filter(article=> article.category == category); 
        if (filteredArticles.length > 0){
            resolve(filteredArticles); 
        }else{
            reject("no results returned"); 
        }
    }); 

}; 

 
// Get artcle by minimum date
const getArticlesByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        //convert datestring to a date object
        const minDate = new Date(minDateStr);
        const filteredArticles = articles.filter(article => new Date(article.date) >= minDate); 
        if (filteredArticles.length > 0) resolve(filteredArticles);
        else reject("no results returned");
    });
};

 
//get Artciles by id
const getArticleById = (id) => { 
    return new Promise((resolve, reject) => { 
        const foundArticle = articles.find(article => article.id == id); 
        if (foundArticle) {
            resolve(foundArticle); 
        } else {
            reject("no result returned"); 
        }
    }); 
};


    module.exports = {
        articles,
        categories,
        initialize,
        getAllArticles,
        getPublishedArticles,
        getCategories,
        addArticle,
        getArticlesByCategory,   
        getArticlesByMinDate,    
        getArticleById     
      };
 