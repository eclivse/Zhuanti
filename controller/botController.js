const { response } = require('express');
const categoryRepository = require('../repository/categoryRepository')
const productRepository = require('../repository/productRepository')

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

class BotController {
    handleWebhook = (req, res, next) => {
        const tag = req.body.queryResult.intent.displayName
        console.log(tag)
        let jsonResponse = {}

        switch (tag) {
            case "menu.list":
                categoryRepository.getCategories((data) => {
                    console.log(data)
                    const options = data.map(category => {
                        return { "text": category.name }
                    });

                    jsonResponse = {
                        "fulfillmentMessages": [
                            {
                                "text": {
                                    "text": [
                                        "Please pick one from our categories:"
                                    ]
                                }
                            },
                            {
                                "payload": {
                                    "richContent": [
                                        [
                                            {
                                                "options": options,
                                                "type": "chips"
                                            }
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                    res.send(jsonResponse)
                })
                
                break;
            case "drinksmenu.list":
                productRepository.getProductsWithCategory(1, (data) => {
                    const response = this.constructMenuResponse("Here is the menu for Drinks:", data)
                    res.send(response)
                })
                break;
            case "beansmenu.list":
                productRepository.getProductsWithCategory(2, (data) => {
                    const response = this.constructMenuResponse("Here is the menu for our Coffee Beans:", data)
                    res.send(response)
                })
                break;
            case "merchmenu.list":
                productRepository.getProductsWithCategory(3, (data) => {
                    const response = this.constructMenuResponse("Here is the menu for our Merchandise:", data)
                    res.send(response)
                })
                break;
            case "allproducts":
                productRepository.getProducts((data) => {
                    const response = this.constructMenuResponse("Here is the full list of our products:", data)
                    res.send(response)
                })
                break;
            case "select.product":
                console.log(res.body)
                res.send("")
                break;
        }
    }

    constructMenuResponse = (title, products) => {
        let menu = []
        products.forEach(product => {
            const item = {
                "type": "list",
                "title": `${product.name} - ${formatter.format(product.price)}`,
                "subtitle": product.description,
                "event": {
                    "name": "select_product_event",
                    "parameters": {
                        "id": product.id,
                        "name": product.name
                    }
                }
            }
            menu.push(item)
            menu.push({
                "type": "divider"
            })
        })
        menu.pop()

        return {
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [title]
                    }
                },
                {
                    "payload": {
                        "richContent": [
                            menu
                        ]
                    }
                }
            ]
        }
    }
}

module.exports = new BotController()