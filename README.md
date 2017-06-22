# How to manage menus in cloudcms
This turorial walks you trough the different steps to create a menu graph that is connected to your content graph:

## Aim
* Manage menus
* Generate sitemaps
* maintain a consitant breadcrumb/pathway (you are here: page > page > ...)

## Setup
The setup of Cloud CMS is handled by a CLI. You need to provide API Keys. If you do not have any [check the documentation](https://www.cloudcms.com/apikeys.html).
Then clone this repository and:
* `$ node install`
* `$ node setup`
    * select **Setup Cloud CMS for the tutorial**
* run again `$ node setup` (soon option will be back)
    * select **Import sample content**
This will create all the necessary content for the demo, but you will still have to link items. This is explained in the tutorial (coming soon).

## Run the app
`$ node app.js`
You have now few endpoints available:
* `/main-menu` -> displays the menu and you can click on the menu items
* `/child-1/a-category`
* `/child-1/child-of-child-1/article-1`
* `/child-2/article-3`

Normally you can add new pages/menu item, but there is no automatic routing implemented, thus you should see your item in the menu, and the breadcrumb should be generated, but the clicking on links will not work.