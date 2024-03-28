# **Add Collection**

Collection ekleme işlemini yeni tablo oluşturmak veya mevcuttaki bir tabloya kayıt eklemek olarak değerlendirebilirsiniz.

Örnekle detaylandıralım;

```json
{
    "collectionName": "product",
    "content": {
        "product_name": "Adidas T-Shirt",
        "product_price": "225",
        "product_description": "AEROREADY DESIGNED TO MOVE SPORT",
        "product_createdDate": 1615256238000,
        "product_sales_count": 0
    }
}
```

Sonuç çıktısı şöyle olmalı;

Status Code:

```ruby
Status Code : 200
```

```json
{
    "id": "623cf3024d17dcf9d1418fb3"
}
```

Hata kodları;

```ruby
Permission Hatası

Status Code : 403
```

## **collectionName:**

Bu alan depoladığınız verinin koleksiyon adını belirtmeniz için kullanılır. Bir bakıma tablo ismi olarak da değerlendirebilirsiniz.

## **content:**

Content alanı koleksiyon içerisinde depolayacağınız verileri belirteceğiniz alandır.
Tablo olarak düşünürsek, **content** alanı kolonlarınızı ve o kolonlarda tutacağınız verileri belirteceğiniz alan olarak değerlendirilebilir.

## **Not:**

*Yukarıda ki örnek düşünüldüğünde, bir **product** tablosu oluşturduk ve ilk  kaydı gerçekleştirdik de diyebiliriz. Yeni kayıtlar eklerken de aynı yöntemi kullanacağız.*

## **Urls:**

Post Url:

```html
https://your-serverip/api/add/collection
```

Android SDK:

```java
PostGet.URL_TYPE.addCollection
```

iOS SDK:

```swift
URL_TYPE.addCollection.description
```

React JS SDK:

```js
Methods.AddCollection
```

##