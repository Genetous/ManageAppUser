# **Add Multiple Collection**

Collection ekleme işlemini yeni tablo oluşturmak veya mevcuttaki bir tabloya kayıt eklemek olarak değerlendirebilirsiniz. Add Multiple Collection birden fazla collection kaydını aynı anda gerçekleştirmenize olanak sağlar.

Örnek olarak;

Basit bir e-ticaret uygulamasının kategorilerini tek seferde ekleme işlemi yapalım.

Bu durumda aşağıdaki örnekte gösterildiği gibi bir model oluşturmalısınız.

```json
{
    "contents": [
        {
            "collectionName": "category",
            "content": {
                "category_name": "Yeni Ürünler"
            }
        },
        {
            "collectionName": "category",
            "content": {
                "category_name": "İndirimler"
            }
        },
        {
            "collectionName": "category",
            "content": {
                "category_name": "Su & İçecek"
            }
        },
        {
            "collectionName": "category",
            "content": {
                "category_name": "Meyve & Sebze"
            }
        }
    ]
}
```

Sonuç çıktısı şöyle olmalı;

Status Code:

```ruby
Status Code : 200
```

```json
[
    {
        "content": {
            "collectionName": "category",
            "content": {
                "category_name": "Yeni Ürünler"
            },
            "id": "623cf4b54d17dcf9d1418fb5"
        },
        "fail": false,
        "success": true
    },
    {
        "content": {
            "collectionName": "category",
            "content": {
                "category_name": "İndirimler"
            },
            "id": "623cf4b54d17dcf9d1418fb6"
        },
        "fail": false,
        "success": true
    },
    {
        "content": {
            "collectionName": "category",
            "content": {
                "category_name": "Su & İçecek"
            },
            "id": "623cf4b54d17dcf9d1418fb7"
        },
        "fail": false,
        "success": true
    },
    {
        "content": {
            "collectionName": "category",
            "content": {
                "category_name": "Meyve & Sebze"
            },
            "id": "623cf4b54d17dcf9d1418fb8"
        },
        "fail": false,
        "success": true
    }
]
```

Hata kodları;

```ruby
Permission Hatası

Status Code : 403
```

## **Not:**

Klasik collection ekleme işlemini **contents** dizisi içerisinde birden fazla olacak şekilde gönderiyoruz. Bu işlem çoklu koleksiyon ekleme işleminde kolaylık sağlayacaktır.

## **Urls:**

Post Url:

```html
https://your-serverip/api/add/multicollection
```

Android SDK:

```java
PostGet.URL_TYPE.addMultiCollection
```

iOS SDK:

```swift
URL_TYPE.addMultiCollection.description
```

React JS SDK:

```js
Methods.AddMultiCollection
```

##