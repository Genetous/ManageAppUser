# **Verify Token**

Daha önce aldığınız **token**'ın geçerliliğini kontrol etmenizi sağlayan fonksiyondur.

Örnekle detaylandıralım;

```ruby
https://your-serverip/auth/verify

In header
Authorization: Bearer your token
```

Bu işlem sonucunda aşağıdaki gibi bir return alırsanız token süreniz dolmuş demektir;

```json
{
    "success": false
}
```

##