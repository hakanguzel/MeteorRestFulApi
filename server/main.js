import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Başlangıçta eğer yoksa MongoDB'de User adlı tablo oluşturur. Varsa veya oluşturduğunda User adlı değişkene bağlar.
  User = new Meteor.Collection('user');
});

if (Meteor.isServer) {
  Router.route('/users', { where: 'server' })
    // GET /users - Tüm users kayıtlarını döndürür
    .get(function () {
      var cevap = User.find().fetch();
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(cevap));
    })

    // POST /user - User bilgilerini MongoDB'deki user tablosuna Kaydeder.
    .post(function () {
      var cevap;
      if (this.request.body.userName === undefined || this.request.body.userPassword === undefined) {
        cevap = {
          "error": true,
          "message": "invalid data"
        };
      } else {
        User.insert({
          UserName: this.request.body.userName,
          UserPassword: this.request.body.userPassword
        });
        cevap = {
          "error": false,
          "message": "User added."
        }
      }
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(cevap));
    });

  Router.route('/users/:id', { where: 'server' })
    // GET /users/:id - MongoDB her kayıt için bir _id değeri atar. Bu değeri göndererek ilgili kaydı görüntüleyebiliriz.
    .get(function () {
      var cevap;
      if (this.params.id !== undefined) {
        var data = User.find({ _id: this.params.id }).fetch();
        if (data.length > 0) {
          cevap = data
        } else {
          cevap = {
            "error": true,
            "message": "User not found."
          }
        }
      }
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(cevap));
    })

    // PUT /users/:id MongoDB her kayıt için bir _id değeri atar. Bu değeri göndererek ilgili kaydı düzenleyebiliriz.
    .put(function () {
      var cevap;
      if (this.params.id !== undefined) {
        var data = User.find({ _id: this.params.id }).fetch();
        if (data.length > 0) {
          if (User.update({ _id: data[0]._id }, { $set: { UserName: this.request.body.userName, UserPassword: this.request.body.userPassword } }) === 1) {
            cevap = {
              "error": false,
              "message": "User information updated."
            }
          } else {
            cevap = {
              "error": true,
              "message": "User information not updated."
            }
          }
        } else {
          cevap = {
            "error": true,
            "message": "User not found."
          }
        }
      }
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(cevap));
    })

    // DELETE /users/:id MongoDB her kayıt için bir _id değeri atar. Bu değeri göndererek ilgili kaydı silebiliriz.
    .delete(function () {
      var cevap;
      if (this.params.id !== undefined) {
        var data = User.find({ _id: this.params.id }).fetch();
        if (data.length > 0) {
          if (User.remove(data[0]._id) === 1) {
            cevap = {
              "error": false,
              "message": "User deleted."
            }
          } else {
            cevap = {
              "error": true,
              "message": "User not deleted."
            }
          }
        } else {
          cevap = {
            "error": true,
            "message": "User not found."
          }
        }
      }
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(cevap));
    });
}

