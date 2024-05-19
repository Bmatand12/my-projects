const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = 4001;

app.use(express.static('client'));
app.use(express.json());


mongoose.connect('mongodb+srv://matan:123@cluster0.zaewmsm.mongodb.net/')
.then(() => {
    console.log('DB is connected.');
});


const userSchema = mongoose.Schema({
    userEmail: String,
    userPassword: String,
    userFullName: String
});

const productSchema = mongoose.Schema({
    productPrice: Number,
    productImg: String,
    productName: String
});
const productOrderSchema = mongoose.Schema({
    productPrice: String,
    productImg: String,
    productName: String,
    productQuantity:Number
});
const orderSchema = mongoose.Schema({
    userName: String,
    products: [productOrderSchema],
    totalPrice: Number
});



const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

User
const productsList = [
 {productName:'Tomato',productPrice:9.80,productImg:"images/tomato.jfif"},
 {productName:'beer',productPrice:14.20,productImg:"images/Beer.jfif"},
 {productName:'blackbread',productPrice:16.70,productImg:"images/BlackBread.jfif"},
 {productName:'Coke',productPrice:11.50,productImg:"images/Coke.jfif"},
 {productName:'Clorox',productPrice:26.90,productImg:"images/Clorox.jfif"},
 {productName:'Eggs',productPrice:12.50,productImg:"images/Eggs.jfif"},
 {productName:'whiteBread',productPrice:13.80,productImg:"images/WhiteBread.jfif"},
 {productName:'SpletBread',productPrice:19.90,productImg:"images/SpletBread.jfif"},
 {productName:'SourdoughBread',productPrice:23.60,productImg:"images/SourdoughBread.jfif"},
 {productName:'dishSoap',productPrice:14.70,productImg:"images/dish soap.jfif"},
 {productName:'CillitBang',productPrice:17.90,productImg:"images/Cillit Bang.jfif"},
 {productName:'sanoJet',productPrice:19.70,productImg:"images/Sano Jet.jfif"},
 {productName:'ZeroCoke',productPrice:13.60,productImg:"images/Zero Coke.jfif"},
 {productName:'Fanta',productPrice:12.60,productImg:"images/Fanta.jfif"},
 {productName:'SparklingWater',productPrice:14.60,productImg:"images/Sparkling Water.jfif"},
 {productName:'SteelWhater',productPrice:15.60,productImg:"images/Steel Whater.jfif"},
 {productName:'RedWine',productPrice:68.60,productImg:"images/Red Wine.jfif"},
 {productName:'Sprite',productPrice:11.30,productImg:"images/Sprite.jfif"},
 {productName:'cucumber',productPrice:6.50,productImg:"images/cucumber.jfif"},
 {productName:'RedDiaper',productPrice:12.90,productImg:"images/Red Diaper.jfif"},
 {productName:'YellowDiaper',productPrice:14.20,productImg:"images/Yellow Diaper.jfif"},
 {productName:'Orange Diaper',productPrice:15.60,productImg:"images/Orange Diaper.jfif"},
 {productName:'RedHotPepper',productPrice:8.60,productImg:"images/Red hot pepper.jfif"},
 {productName:'GreenHotPepper',productPrice:7.60,productImg:"images/Green hot pepper.jfif"},
 {productName:'GreenGrapes',productPrice:51.20,productImg:"images/green grapes.jfif"},
 {productName:'RedGrapes',productPrice:59.30,productImg:"images/red grapes.jfif"},
 {productName:'strawberry',productPrice:48.90,productImg:"images/strawberry.jfif"},
 {productName:'lettuce',productPrice:21.90,productImg:"images/lettuce.jfif"},
 {productName:'PinkLadyApple',productPrice:27.90,productImg:"images/pink lady apple.jfif"},
 {productName:'SalmonFish',productPrice:57.90,productImg:"images/Salmon Fish.jfif"},
 {productName:'ChickenBreast',productPrice:41.20,productImg:"images/Chicken Breast.jfif"},
 {productName:'Milk',productPrice:7.80,productImg:" images/Milk.jfif"},
 {productName:'SoyMilk',productPrice:12.90,productImg:"images/MilkSoy.jfif"},
 {productName:'YellowCheese',productPrice:24.60,productImg:"images/YellowCheese.jfif"},
 {productName:'MozzarellaCheese',productPrice:32.60,productImg:"images/Mozzarella Cheese.jfif"},
 {productName:'BissliPizza',productPrice:2.80,productImg:"images/BissliPizza.jfif"},
 {productName:'DoritosBBQ',productPrice:4.50,productImg:"images/DoritosBBQ.jfif"},
 {productName:'KinderJoy',productPrice:7.90,productImg:"images/KinderJoy.jfif"},
 {productName:'Snickers',productPrice:6.30,productImg:"images/Snickers.png"}
];
const saveProducts = async () => {
    try {
        await Product.insertMany(productsList);
        console.log('All products have been saved successfully!');
    } catch (error) {
        console.error('Error saving products:', error);
    }
};
saveProducts();


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'homePage.html'));
});

app.get('/paymentPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'paymentPage.html'));
});

app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'sign-up.html'));
});

app.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'sign-in.html'));
});

app.post('/sign-up', async (req, res) => {
    const { userFullName, userEmail, userPassword } = req.body;
    try {
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(409).send("User with this email already exists");
        }
        const newUser = new User({
            userEmail,
            userPassword,
            userFullName
        });
        await newUser.save();
        res.json({ message: `Hello ${userFullName} You signed up successfully!`, userFullName });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Error signing up.' });
    }
});

app.post('/sign-in', async (req, res) => {
    const credentials = req.body;
    try {
        const existingUser = await User.findOne({ userEmail: credentials.userEmail });
        if (existingUser && existingUser.userPassword === credentials.password) {
            res.send(`Welcome Back ${existingUser.userFullName}.`);
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Error signing in.' });
    }
});

app.post('/get-products', async (req, res) => {
    const { search, minPrice, maxPrice } = req.body;
    const nameRegex = new RegExp(search, 'i');
    console.log(`searching products`, search);
    try {
        let query = { productName: nameRegex };
        if (minPrice !== undefined && maxPrice !== undefined) {
            query.productPrice = { $gte: minPrice, $lte: maxPrice };
        }
        const products = await Product.find(query);
        console.log(products); 
        res.json({ products });
    } catch (error) {
        console.error('can not load products:', error);
        res.status(500).json({ error: 'Error can not load products.' });
    }
});

app.post('/buy', async (req, res) => {
    const { username, cartItems, totalPrice } = req.body;
    console.log( username, cartItems, totalPrice)
    console.log(req.body)

    try {
        const order = new Order({ userName:username, products: cartItems.map((x)=>{
            return {productPrice: x.price, productImg: x.prodictImg, productQuantity: parseFloat(x.productQuantity), productName: x.title};
        }), totalPrice });
        await order.save();
        console.log('Order saved successfully!');
        res.json({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Error placing order.' });
    }
});

const isAdmin = (req, res, next) => {
    const isAdmin = req.query.admin === 'true';
    if (isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin permission required.' });
    }
};



app.get('/all', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ error: 'Error retrieving orders.' });
    }
});


app.use((req, res) => {
    res.status(404).send('Error: Page Not Found'); 
});

app.use((req, res) => {
    res.status(404).send('Error: Page Not Found'); 
});


app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
