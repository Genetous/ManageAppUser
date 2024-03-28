# **Get Collection**

Daha önce oluşturmuş olduğunuz koleksiyon verilerinin seçme ve filtreleme işlemlerini gerçekleştireceğiniz fonksiyondur.

**Genetous** koleksiyon verilerini aşağıdaki örnekte olduğu gibi depolar.
Bu örnekte Ömer, Caner, İbrahim ve Bahar koleksiyonlarının verisinin nasıl depolandığını görüyorsunuz.

```json
{
    "collectionName": "person",
    "content": {
        "personAge": 37,
        "personName": "Ömer"
    },
    "id": "6227d18c5045e57a4fdf32f7"
},
{
    "collectionName": "person",
    "content": {
        "personAge": 39,
        "personName": "İbrahim"
    },
    "id": "6227d1995045e57a4fdf32f9"
},
{
    "collectionName": "person",
    "content": {
        "personAge": 42,
        "personName": "Caner"
    },
    "id": "6227d1a35045e57a4fdf32fb"
},
{
    "collectionName": "person",
    "content": {
        "personAge": 35,
        "personName": "Bahar"
    },
    "id": "6227d1aa5045e57a4fdf32fd"
}
```

**Genetous**'un nasıl koleksiyon verisini depoladığını gördüğümüze göre şimdi seçme ve filtreleme işlemlerini açıklayalım.

**Genetous** kendisine ait olan bir Json modeli ile sorguları gerçekleştirmenize izin verir.

Yukarıdaki örneği dikkate olarak sorgu örneklemesi yapalım;

```json
{
    "collectionName": "person"
}
```

Şeklinde bir sorgu gönderdiğinizde, koleksiyon adı ***person*** olan bütün kayıtları çıktı olarak alırsınız.

## **AND**

**Genetous** <u>***İlk Object***</u> içerisine yazdığınız bütün alanları **AND** olarak algılar.

Örnek;

```json
{
    "collectionName": "person",
    "content.personAge": 42,
}
```

Bu örnekte, koleksiyon adı **person** ve yaşı 42 olan verileri size getirecektir.

## **Pagination**

Verilerin sayfalanması da kod optimizasyonu için çok önemlidir. Sayfalama işlemi ise şöyle gerçekleşir.

```json
{
    "collectionName": "person",
    "from":0,
    "size":10
}
```

Bu örnekte, koleksiyon adı ***person*** olan verilerin 0 ve 10 arası kaydı getirilecektir.

## **Order By**

Sayfalama esnasında en önemli unsur ise veri sıralamasıdır. **Genetous** ta veri sıralaması ve sayfalama örneğini birlikte gösterelim.

```json
{
    "collectionName": "person",
    "from":0,
    "size":10,
     "orderby": {
        "field": "content.personAge",
        "type": "desc"
    }
}
```

Bu örnekte, yaş sırasına göre tersten sıralar ve 0 ile 10 arası kaydı getirir.

## **OR**

Yukarıdaki örnek üzerinde **OR** sorgusunu örnekleyelim.

```json
{
    "collectionName": "person",
    "or": [
        {
            "content.personAge": 35
        },
        {
            "content.personAge": 37
        }
    ]
}
```

Bu örnekte koleksiyon verisi içerisindeki kişi yaşı 35 veya 37 olan kayıtları getir komutu gönderdik.

## **Greater Than:**

Yukarıdaki örnek üzerinde **Greater Than** sorgusunu örnekleyelim.

```json
{
    "collectionName": "person",
    "gt":{
        "content.personAge": 35
    }
}
```

Bu örnekte, koleksiyon verisi içerisindeki kişi yaşı 35'in üzerinde olan kişilerin kayıtlarını getir komutu gönderdik.

## **Less Than:**

Yukarıdaki örnek üzerinde **Less Than** sorgusunu örnekleyelim.

```json
{
    "collectionName": "person",
    "lt":{
        "content.personAge": 35
    }
}
```

Bu örnekte, koleksiyon verisi içerisindeki kişi yaşı 35'in altında olan kişilerin kayıtlarını getir komutu gönderdik.

## **Urls:**

Post Url:

```html
https://your-serverip/api/get/collections
```

Android SDK:

```java
PostGet.URL_TYPE.getCollections
```

iOS SDK:

```swift
URL_TYPE.getCollections.description
```

React JS SDK:

```js
Methods.GetCollections
```

##