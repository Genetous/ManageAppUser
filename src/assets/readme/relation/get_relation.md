# **Get Relation**

Daha önce oluşturmuş olduğunuz ilişkisel verilerin seçme ve filtreleme işlemlerini gerçekleştireceğiniz fonksiyondur.

**Genetous** ilişkisel verileri aşağıdaki örnekte olduğu gibi depolar.
Bu örnekte Ömer adlı kullanıcının Caner, İbrahim ve Bahar ile arkadaş ilişkisi verisinin nasıl depolandığını görüyorsunuz.

```json
{
    "_id": "6227d2775045e57a4fdf3300",
    "relationName": "friends",
    "to": "6227d18c5045e57a4fdf32f7",
    "to_collectionName": "person",
    "collection_content": {
        "_id": "6227d18c5045e57a4fdf32f7",
        "collectionName": "person",
        "content": {
            "personAge": 37,
            "personName": "Ömer"
        }
    },
    "content": {
        "person": [
            {
                "_id": "6227d1995045e57a4fdf32f9",
                "collectionName": "person",
                "content": {
                    "personAge": 39,
                    "personName": "İbrahim"
                }
            },
            {
                "_id": "6227d1a35045e57a4fdf32fb",
                "collectionName": "person",
                "content": {
                    "personAge": 42,
                    "personName": "Caner"
                }
            },
            {
                "_id": "6227d1aa5045e57a4fdf32fd",
                "collectionName": "person",
                "content": {
                    "personAge": 35,
                    "personName": "Bahar"
                }
            }
        ]
    }
}
```

Yukarıdaki örnekteki alanları açıklayalım;

## **relationName:**

Kurulan ilişki verisine verilecek isim.

## **to:**

Kurulan ilişkinin ana koleksiyonun id'si. İlişikilendirilen alt koleksiyonların hangi id'ye bağlandığını ifade eder. Temel olarak veri arama işlemini kolaylaştırmak için kullanılan bir alandır.

## **to_collectionName:**

Kurulan ilişkinin ana koleksiyonunun ismidir. Temel olarak veri arama işlemini kolaylaştırmak için kullanılan bir alandır.

## **collection_content:**

Kurulan ilişkinin ana koleksiyonun verisinin tamamını içerir. Temel olarak veri arama işlemini kolaylaştırmak için kullanılan bir alandır.

## **content:**

Content alanı, klasik **Genetous** veri depolama modelinde olduğu gibi burada da içeriğin tamamını barındırır. Bütün ilişkiker dizi olarak bu alan içerisinde depolanır.

## **person Dizisi:**

Person dizisi alt ilişki kurulmuş olan verilerin collectionName verisinin sistem tarafından otomatik olarak atanmasıyla oluşur. Burada önemli olan relationName de verdiğiniz ilişki ismidir. Bu isimle altta hangi ilişkiyi kuruduğunuzu belirlemelisiniz.

**Genetous**'un nasıl ilişkisel veri depoladığını gördüğümüze göre şimdi seçme ve filtreleme işlemlerini açıklayalım.

**Genetous** kendisine ait olan bir Json modeli ile sorguları gerçekleştirmenize izin verir.

Yukarıdaki örneği dikkate olarak sorgu örneklemesi yapalım;

```json
{
    "relationName": "friends"
}
```

Şeklinde bir sorgu gönderdiğinizde, ilişki adı ***friends*** olan bütün kayıtları çıktı olarak alırsınız.

## **AND**

**Genetous** <u>***İlk Object***</u> içerisine yazdığınız bütün alanları **AND** olarak algılar.

Örnek;

```json
{
    "relationName": "friends",
    "to": "6227d1aa5045e57a4fdf32fd",
}
```

Bu örnekte, ilişki adı **friends** ve bağlanılan ana koleksiyon id'si ***6227d1aa5045e57a4fdf32fd*** olan verileri size getirecektir.

## **Pagination**

Verilerin sayfalanması da kod optimizasyonu için çok önemlidir. Ana koleksiyonların esas alındığı sayfalama işlemi ise şöyle gerçekleşir.

```json
{
    "relationName": "friends",
    "from":0,
    "size":10
}
```

Bu örnekte, ilişki adı friends olan verilerin 0 ve 10 arası kaydı getirilecektir.

## **Order By**

Sayfalama esnasında en önemli unsur ise veri sıralamasıdır. **Genetous** ta veri sıralaması ve sayfalama örneğini birlikte gösterelim.

```json
{
    "relationName": "friends",
    "from":0,
    "size":10,
     "orderby": {
        "field": "collection_content.id",
        "type": "desc"
    }
}
```

Bu örnekte collection_content'i eklenme sırasına göre tersten sıralar ve 0 ile 10 arası kaydı getirir.

## **OR**

Yukarıdaki örnek üzerinde **OR** sorgusunu örnekleyelim.

```json
{
    "relationName": "friends",
    "or": [
        {
            "collection_content.content.personAge": 35
        },
        {
            "collection_content.content.personAge": 37
        }
    ],
}
```

Bu örnekte ana koleksiyon verisi içerisindeki kişi yaşı 35 veya 37 olan kayıtları getir komutu gönderdik.

## **Greater Than:**

Yukarıdaki örnek üzerinde **Greater Than** sorgusunu örnekleyelim.

```json
{
    "relationName": "friends",
    "gt":{
        "collection_content.content.personAge": 35
    }
}
```

Bu örnekte ana koleksiyon verisi içerisindeki kişi yaşı 35'in üzerinde olan kişilerin kayıtlarını getir komutu gönderdik.

## **Less Than:**

Yukarıdaki örnek üzerinde **Less Than** sorgusunu örnekleyelim.

```json
{
    "relationName": "friends",
    "lt":{
        "collection_content.content.personAge": 35
    }
}
```

Bu örnekte ana koleksiyon verisi içerisindeki kişi yaşı 35'in altında olan kişilerin kayıtlarını getir komutu gönderdik.

## **Fields:**

Fields dizisi alt ilişkilendirilmiş olan verilerin seçme ve filtreleme işlemlerinin gerçekleştirildiği alandır.

Yukarıdaki örnekte, 3 arkadaş verisini content içerisindeki person dizisi içerisinde görebilirsiniz. Şimdi onların seçme ve filtrelemelerinin nasıl olduğunu örnekleyelim;

```json
{
    "relationName": "friends",
    "fields": [
        {
            "content.person": {
            }
        }
    ]
}
```

Yukarıdaki örnekte, ilişki adı **friends** olan verilerin alt ilişkisi **person** olan verilerin getirilmesi komutunu verdik. Bir ilişki içerisinde birden fazla alt ilişki kurulabilir. Burada biz sadece **person** olan kayıtları talep ettik.

## **Fields Pagination:**

Fields dizisi alt ilişkilendirilmiş olan verilerin sayfalanmsı için kullanılan alandır.

Yukarıdaki örnekte, 3 arkadaş verisini content içerisindeki person dizisi içerisinde görebilirsiniz. Şimdi onların sayfalanmasını yapalım;

```json
{
    "relationName": "friends",
    "fields": [
        {
            "content.person": {
                "from": 0,
                "size": 1
            }
        }
    ]
}
```

Yukarıdaki örnekte, ilişki adı **friends** olan verilerin alt ilişkisi **person** olan verilerin 0'dan başlayarak sadece 1 tanesinin getirilmesi komutunu verdik.

## **Fields Order By:**

Fields dizisi alt ilişkilendirilmiş olan verilerin sıralanması için kullanılan alandır.

Yukarıdaki örnekte, 3 arkadaş verisini content içerisindeki person dizisi içerisinde görebilirsiniz. Şimdi onların sıralanmasını yapalım;

```json
{
    "relationName": "friends",
    "fields": [
        {
            "content.person": {
                "orderby": {
                    "field": "content.personAge",
                    "type": "asc"
                }
            }
        }
    ]
}
```

Yukarıdaki örnekte, ilişki adı **friends** olan verilerin alt ilişkisi **person** verilerinin **content** verisi içerindeki kişi yaşı küçükten büyüğe olacak şekilde sıralanarak getirilmesi komutunu verdik.

## **Fields Greater Than:**

Fields dizisi alt ilişkilendirilmiş olan verilerin bir limit üzerinde olanların getirilmesi için kullanılan alandır.

Yukarıdaki örnekte, 3 arkadaş verisini content içerisindeki person dizisi içerisinde görebilirsiniz. Şimdi onların bir limit üzerinde olanların getirilmesini yapalım;

```json
{
    "relationName": "friends",
    "fields": [
        {
            "content.person": {
                "gt":{
                    "content.personAge":38
                }
            }
        }
    ]
}
```

Yukarıdaki örnekte, ilişki adı **friends** olan verilerin alt ilişkisi **person** verilerinin **content** verisi içerindeki kişi yaşı 38' den büyük olanların getirilmesi komutunu verdik.

## **Fields Less Than:**

Fields dizisi alt ilişkilendirilmiş olan verilerin bir limit altında olanların getirilmesi için kullanılan alandır.

Yukarıdaki örnekte, 3 arkadaş verisini content içerisindeki person dizisi içerisinde görebilirsiniz. Şimdi onların bir limit altında olanların getirilmesini yapalım;

```json
{
    "relationName": "friends",
    "fields": [
        {
            "content.person": {
                "lt":{
                    "content.personAge":38
                }
            }
        }
    ]
}
```

Yukarıdaki örnekte, ilişki adı **friends** olan verilerin alt ilişkisi **person** verilerinin **content** verisi içerindeki kişi yaşı 38' den küçük olanların getirilmesi komutunu verdik.

## **Urls:**

Post Url:

```html
https://your-serverip/api/get/relations
```

Android SDK:

```java
PostGet.URL_TYPE.getRelations
```

iOS SDK:

```swift
URL_TYPE.getRelations.description
```

React JS SDK:

```js
Methods.GetRelations
```

##