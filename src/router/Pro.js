const express = require("express");
const Razorpay = require('razorpay');

const router = express.Router();
const session = require('express-session');
require("../db/conn");


const bodyParser = require("body-parser");
const cors = require("cors");
router.use(cors());


router.use(express.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(session({
     secret: 'FvSuFPspj+BeeUxI',
     resave: false,
     saveUninitialized: false,
}));


const order = require("../model/order");
const c_register = require('../model/customer');
const uploadP = require("../model/uploadP");
const p_register = require('../model/painter');

var multer = require('multer');
var path = require('path');


router.use(express.static(path.join(__dirname, "../public/")));


var p = path.join(__dirname, "../../../myproject/src/public/uploads");
var up = path.join(__dirname, "../../../myproject/src/public/uploadimg");



const { paccount, plogin, pregister,
     plogout, addp, uprofileD, uprofileDP,
     getimg, upaintingD, imglist, delimg,
     Clogin, cretister, caccount, clogout, uprofileDPC,
     allpainter, p_detail, findimg, addcart, findcart,
     cartdelete, qtyg, qty1, Cfpass, Pfpass, findimgdata, p_imgdetail, uprofileDC, upaintingDP } = require('../controller/control.js');

console.log(up);

router.get("/", (req, res) => {
     console.log(req.session);
     res.send("i am por.js page");
});


router.post("/plogin", plogin);


//upload image page 
var Storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, p);
     },
     filename: (req, file, cb) => {
          cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
     }


});


var upload = multer({
     storage: Storage
}).single('myfile');


router.post('/pregister', upload, pregister);
router.get("/plogout", plogout);
router.get("/paccount", paccount);


function check(req, res, next) {
     localStorage.getItem('ptoken');
     if (localStorage.getItem('ptoken')) {
          next();
     }
     else {
          return res.status(203).send("no");
     }


}

//add painting 
router.get("/addP", check, async (req, res) => {
     return res.send("add card show");
})

//upload image page 
var Storage1 = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, up);
     },
     filename: (req, file, cb) => {
          cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
     }


});

var upload1 = multer({
     storage: Storage1
}).single('myfile');

router.post('/addp', upload1, addp);

// show list of painting

router.get("/imglist", imglist);

router.get("/delimg/:id", delimg);

router.post('/uprofileD', uprofileD);

router.post('/uprofileDP', upload, uprofileDP);

router.get("/getimg/:id", getimg);

router.post('/upaintingD', upaintingD);


router.post('/upaintingDP', upload1, upaintingDP);

// customer login page


function check_c(req, res, next) {
     var cname = localStorage.getItem('loginC');
     var id = localStorage.getItem('cid');
     console.log(cname);
     if (cname) {
          next();
     }
     else {
          return res.status(203).send("no");
     }

}

router.post("/Clogin", Clogin);

// customer register

router.post('/cretister', upload, cretister);

//customer account

router.get("/caccount", caccount);



// custober logout


router.get("/clogout", clogout);

// update customer profile data

router.post('/uprofileDC', uprofileDC);



router.post('/uprofileDPC', upload, uprofileDPC);


// all painter show 

router.get("/allpainter", allpainter);


router.get("/p_detail/:id", p_detail);



router.get("/p_imgdetail/:id", p_imgdetail);


router.get('/findimg/:id', findimg);

router.get('/Addcart/:id', addcart);


router.get("/findcart", findcart);

router.get("/cartdelete/:id", cartdelete);

router.get("/qtyg/:id", qtyg);

router.get("/qtyl/:id", qty1);


router.post("/Cfpass", Cfpass);


router.post("/Pfpass", Pfpass);


router.get("/findimgdata", findimgdata);

router.post("/order", async (req, res) => {
     console.log(req.body);
     const { CID, Product_ID, Status, payment_id } = req.body;
     console.log(Product_ID);
     const add = new order({ CID: CID, Products: Product_ID, Status: Status, payment_id: payment_id });
     add.save();
     return res.status(200).json({ mess: "Payment successfully" });
})

router.get("/order", async (req, res) => {
     var id = localStorage.getItem('painterId');
     const p = await p_register.find({ _id: id });
     var arr = [];
     var d1;
     var f = 0;
     var c1 = 0;
     p[0].FirstName
     if (id) {
          const data = await order.find({});

          for (let i = 0; i < data.length; i++) {
               if (data[i].Products[0].ArtName === p[0].FirstName) {
                    f = 1;
                    arr[c1] = data[i];
                    const c = await c_register.find({ _id: data[i].CID });
                    const { FirstName, LastName } = c[0];
                    d1 = {
                         arr, FirstName: FirstName, LastName: LastName
                    };
                    c1++;
               }


          }
          if (f === 0) {
               return res.status(200).send({ "mess": "no" });
          }
          else {
               return res.status(200).send(d1);
          }

     }
     else {
          return res.status(201).send("no");
     }
})


router.get("/order1", async (req, res) => {
     var id = localStorage.getItem('cid');
     console.log(id);
     const p = await c_register.find({ _id: id });
     var arr = [];
     var d1;
     var f = 0;
     var c1 = 0;
     p[0].FirstName

     if (id) {
          const data = await order.find({});
          console.log(data[0]);
          for (let i = 0; i < data.length; i++) {
               if (data[i].CID == p[0]._id) {
                    console.log("yes");
                    f = 1;
                    arr[c1] = data[i];
                    const c = await c_register.find({ _id: data[i].CID });
                    const { FirstName, LastName } = c[0];
                    d1 = {
                         arr, FirstName: FirstName, LastName: LastName
                    };
                    c1++;
               }
          }
          if (f <= 0) {
               return res.status(200).send({ "mess": "no" });
          }
          else {
               return res.status(200).send(d1);
          }

     }
     else {
          return res.status(201).send("no");
     }
})



router.post("/orderC", async (req, res) => {
     const id = req.body.id;
     const data = await order.findByIdAndDelete({ _id: id });
     if (data) {
          return res.status(200).json({ mess: "order cancled" });
     }
     else {
          return res.status(201).send("somthing wrong");
     }

})




router.post("/orderA", async (req, res) => {
     const _id = req.body.id;
     const s = "Accept";
     const data = await order.findByIdAndUpdate(_id, { Status: s });
     if (data) {
          console.log(data);
          return res.status(200).json({ mess: "order Accept" });
     }
     else {
          return res.status(201).send("somthing wrong");
     }

})
module.exports = router;