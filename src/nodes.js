module.exports = {
    setup: [
        require("../imports/types/article.json"),
        require("../imports/types/category.json"),
        require("../imports/types/menu.json"),
        require("../imports/associations/a:category-association.json"),
        require("../imports/associations/a:menu-association.json"),
        require("../imports/associations/a:parent-menu-association.json")
    ],
    content: [
        require("../imports/content/root-menu-item.json"),
        require("../imports/content/menu-item1.json"),
        require("../imports/content/menu-item2.json"),
        require("../imports/content/menu-item3.json"),
        require("../imports/content/article1.json"),
        require("../imports/content/article2.json"),
        require("../imports/content/article3.json"),
        require("../imports/content/category.json"),
    ]
}