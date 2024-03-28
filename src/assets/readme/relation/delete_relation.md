# **Delete Relation**

Eklemiş olduğunuz relation verisini silmek için kullanılır. Klasik bir silme işlemi ile neredeyse aynı özellikleri barındırır.

Örnek olarak;

Daha önce **Add Relation** örneğinde eklemiş olduğumuz verinin silme işlemini gerçekleştirelim.

Bkz. [Add Relation](./#/addrelation)

Bu durumda aşağıdaki örnekte gösterildiği gibi bir model oluşturmalısınız.

```json
{
    "ids": [
        "62269137c82fc9a3d6f52ae3"
    ]
}
```

Sonuç çıktısı şöyle olmalı;

Status Code:

```ruby
Status Code : 200
```

Hata kodları;

```ruby
Permission Hatası

Status Code : 403
```

## **Not:**

Silme işlemini gerçekleştirmek için ilişkinin id verisini göndermek yeterli olacaktır.

## **Urls:**

Post Url:

```html
https://your-serverip/api/delete/relation
```

Android SDK:

```java
PostGet.URL_TYPE.deleteRelation
```

iOS SDK:

```swift
URL_TYPE.deleteRelation.description
```

React JS SDK:

```js
Methods.DeleteRelation
```

##