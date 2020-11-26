var express = require('express');
var app = express();
var mongoose = require('mongoose');
var methodOverride = require('method-override')
var bodyParser = require('body-parser');
var cors = require('cors');

mongoose.connect('mongodb://localhost:27017/bbg-db', { useNewUrlParser: true, useUnifiedTopology: true });

var Products = mongoose.model('products', {
    id:String,
    creationDate:Date,
    name: String, 
    description:String,
    price:Number,
    urlImage:String
});

app.use( express.static( __dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride());
app.use(cors());

mongoose.set('useFindAndModify', false);

app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/products', function(req,res){
    Products.create(
    req.body
    , function(error, products){
        if(error){
            res.send(error);
        }
        Products.find( function(error,products){
            if(error){
                res.send(error);
            }
            res.json(products);
        })
    })
})

app.get('/api/products', function(req, res){
    Products.find( function(error,products){
        if(error){
            res.send(error);
        }
        res.json(products);
    })
})

app.get('/api/products/:item', function(req, res){
    Products.findOne({
        _id: req.params.item
    }, function(error,products){
        if(error){
            res.send(error);
        }
        res.json(products);
    })
})

app.delete('/api/products/:item',function(req, res){
    Products.remove({
        _id: req.params.item
    }, function(error, products){
        if(error){
            res.send(error);
        }
        Products.find( function(error,products){
            if(error){
                res.send(error);
            }
            res.json(products);
        })
    })
    
})

app.put('/api/products/:item', function(req,res){
    Products.findOneAndUpdate(
        { _id: req.params.item },
        req.body,
        function(error, products){
            if(error){
                res.send(error);
            }
            Products.find( function(error,products){
                if(error){
                    res.send(error);
                }
                res.json(products);
            })
        })
})

app.listen( 8080 , function(){
    console.log("Products Server");
})