# **Kill Token**

Daha önce aldığınız **token**'ın geçerliliğini sonlandırmanızı sağlayan fonksiyondur.

Örnekle detaylandıralım;

```ruby
https://your-serverip/auth/logout

Form-Data
token: your token
```

Bu işlem sonucunda aşağıdaki gibi bir return alırsınız;

```json
{
    "success": true
}
```

##