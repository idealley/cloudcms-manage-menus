module.exports = {
    setup: [
        require("../types/article.json"),
        require("../types/category.json"),
        require("../types/menu.json"),
        require("../associations/a:category-association.json"),
        require("../associations/a:menu-association.json"),
        require("../associations/a:parent-menu-association.json")
    ],
    content: [
        require("../content/root-menu-item.json"),
        require("../content/menu-item1.json"),
        require("../content/menu-item2.json"),
        require("../content/menu-item3.json"),
        require("../content/article1.json"),
        require("../content/article2.json"),
        require("../content/article3.json"),
        require("../content/category.json"),
    ]
}