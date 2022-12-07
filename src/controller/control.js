const c_register = require('../model/customer');
const p_register = require('../model/painter');
const uploadP = require("../model/uploadP");
const addSchema = require("../model/addcart");
const bc = require("bcryptjs");

var jwt = require('jsonwebtoken');


if (typeof localStorage === "undefined" || localStorage === null) {
     var LocalStorage = require('node-localstorage').LocalStorage;
     localStorage = new LocalStorage('./scratch');
}
// painter all route

const plogin = async (req, res) => {
     const { Email, Password } = req.body;
     const match = await p_register.findOne({ Email: Email });
     if (!match) {
          return res.status(202).json({ "message": "email not match" });
     }
     else {
          const DP = match.Password;
          const PID = match.id;

          if (bc.compareSync(Password, DP)) {
               console.log("PID: " + PID);
               var token = jwt.sign({ paintertoken: PID }, 'paintertoken');
               localStorage.setItem("ptoken", token);
               localStorage.setItem("loginP", match.FirstName);
               localStorage.setItem("painterId", PID);
               // sess = req.session;
               // sess.p = PID;
               return res.status(201).json({ "message": "successfully login" });
          }
          else {
               return res.status(202).json({ "message": "something is wrong" });
          }

     }



}
const paccount = async (req, res) => {
     var pname = localStorage.getItem('loginP');
     var id = localStorage.getItem('painterId');
     if (!id) {
          return res.status(201).json({ "pname": null });
     }
     else {
          try {
               const getstudent = await p_register.find({ _id: id });
               console.log(getstudent);
               return res.status(200).send(getstudent);
          }
          catch (e) {
               return res.status(400).send(e);
          }
     }

}
const pregister = async (req, res) => {
     var Profile = req.file.filename;
     console.log(Profile);
     console.log(req.body);
     const { FirstName, LastName, Address, Email, Password, Country, Pincode, PhoneNumber, cpassword } = req.body;

     try {
          // email is present before or not
          const r = await p_register.findOne({ Email: Email });
          if (r) {
               return res.status(202).json({ error: 'Email alredy exists' });
          }
          // all filled not null
          else if (FirstName === "undefined" || LastName === "undefined" || Address === "undefined" || Email === "undefined" || Password === "undefined" || Country === "undefined" || Pincode === "undefined" || PhoneNumber === "undefined" || cpassword === "undefined") {
               return res.status(202).json({ error: "plz filled the field property" });
          }

          // check password and cpassword should be same
          else if (Password != cpassword) {
               return res.status(202).json({ error: "password not match" });
          }
          else {
               const painter = new p_register({ FirstName, LastName, Address, Email, Password, Country, Pincode, PhoneNumber, Profile });
               painter.save();
               return res.status(201).json({ message: 'paiter register successfully' });
          }


     } catch (e) {
          console.log(e);
     }
}
const plogout = async (req, res) => {
     localStorage.removeItem('ptoken');
     localStorage.removeItem('loginP');
     localStorage.removeItem('painterId');
     return res.status(201).json({ "message": "painter logout successfull" });
     // req.session.destroy(function (err) {
     //      sess = {};
     //      return res.status(201).json({ "message": "painter logout successfull" });
     // })
}
const addp = async (req, res) => {
     var PID = localStorage.getItem('painterId');
     var Profile = req.file.filename;
     const { Imgtype, Artname, Rprice, Dprice, Size, Medium, Surface, Year } = req.body;
     console.log(req.body);
     if (Imgtype === "" || Artname === "" || Rprice === "" || Dprice === "" || Size === "" || Medium === "" || Surface === "" || Year === "") {
          return res.status(201).json({ error: "plz filled the field property" });
     }
     else {
          const uploadimg = new uploadP({ Imgtype, Artname, Rprice, Dprice, Size, Medium, Surface, Year, Profile, PID });
          uploadimg.save();
          return res.status(200).json({ message: 'img  upload successfully' });
     }

}
const uprofileD = async (req, res) => {
     const { FirstName, LastName, Address, Email, Country, Pincode, PhoneNumber } = req.body;
     console.log(req.body);
     const _id = req.body._id;
     console.log(req.body._id + " === " + _id);
     try {
          const profiled = {
               FirstName: FirstName,
               LastName: LastName,
               Address: Address,
               Email: Email,
               Country: Country,
               Pincode: Pincode,
               PhoneNumber: PhoneNumber,
          }
          const updateProfile = await p_register.findByIdAndUpdate(_id, profiled);
          return res.status(200).send(updateProfile);
     }
     catch (e) {
          console.log(e);
     }

}
const uprofileDP = async (req, res) => {
     const Profile = req.file.filename;
     const { FirstName, LastName, Address, Email, Country, Pincode, PhoneNumber } = req.body;
     const _id = req.body._id;
     try {
          const profiled = {
               Profile: Profile,
               FirstName: FirstName,
               LastName: LastName,
               Address: Address,
               Email: Email,
               Country: Country,
               Pincode: Pincode,
               PhoneNumber: PhoneNumber,
          }
          const updateProfile = await p_register.findByIdAndUpdate(_id, profiled);
          return res.status(200).send(updateProfile);
     }
     catch (e) {
          console.log(e);
     }

}
const getimg = async (req, res) => {

     const id = req.params.id;
     try {
          const getstu = await uploadP.findById({ _id: id });
          return res.status(200).send(getstu);

     }
     catch (e) {
          console.log(e);
     }

}
const upaintingD = async (req, res) => {
     const { Imgtype, Artname, Rprice, Dprice, Size, Medium, Surface, Year } = req.body;
     const _id = req.body._id;
     console.log(req.body._id + " === " + _id);
     try {
          const Pupload = {
               Imgtype: Imgtype,
               Artname: Artname,
               Rprice: Rprice,
               Dprice: Dprice,
               Size: Size,
               Medium: Medium,
               Surface: Surface,
               Year: Year,
          }
          const updateProfile = await uploadP.findByIdAndUpdate(_id, Pupload);
          console.log("updata painting record");
          console.log(updateProfile);
          return res.status(200).send(updateProfile);
     }
     catch (e) {
          console.log(e);
     }

}
const imglist = async (req, res) => {
     var id = localStorage.getItem('painterId');
     const up = await uploadP.find({ PID: id });
     if (up) {
          return res.status(200).send(up);
     }
     else {
          return res.status(201).send("image is not uploaded");
     }
}
const delimg = async (req, res) => {
     const id = req.params.id;
     try {
          const getstu = await uploadP.findByIdAndDelete({ _id: id });
          return res.status(200).send(getstu);
     }
     catch (e) {
          console.log(e);
     }

}
const upaintingDP = async (req, res) => {
     const P = req.file.filename;
     console.log(P);
     const { Imgtype, Artname, Rprice, Dprice, Size, Medium, Surface, Year } = req.body;
     const _id = req.body._id;
     try {
          const Pupload = {
               Profile: P,
               Imgtype: Imgtype,
               Artname: Artname,
               Rprice: Rprice,
               Dprice: Dprice,
               Size: Size,
               Medium: Medium,
               Surface: Surface,
               Year: Year,
          }
          const updateProfile = await uploadP.findByIdAndUpdate(_id, Pupload);
          console.log("updata paint");
          console.log(updateProfile);
          return res.status(200).send(updateProfile);
     }
     catch (e) {
          console.log(e);
     }

}

// customer route

const Clogin = async (req, res) => {
     console.log("clogin");
     console.log(req.body);
     const { Email, Password } = req.body;
     console.log(Email);
     console.log(Password);
     const match = await c_register.findOne({ Email });
     console.log("match ====>", match);
     if (!match) {
          return res.status(202).json({ "message": "email not match" });
     }
     else {
          const Pass = match.Password;
          const CID = match.id;
          if (bc.compareSync(Password, Pass)) {

               var token = jwt.sign({ cainterId: CID }, 'custombertoken');
               localStorage.setItem("ctoken", token);
               localStorage.setItem("loginC", match.FirstName);
               localStorage.setItem("cid", match.id);
               return res.status(201).json({ "message": "successfully login" });
          }
          else {
               return res.status(202).json({ "message": "something is wrong" });
          }


     }



}
const cretister = async (req, res) => {
     var Profile = req.file.filename;
     const { FirstName, LastName, Address, Email, Password, Country, Pincode, PhoneNumber, cpassword } = req.body;
     console.log(req.body);
     if (FirstName === "undefined" || LastName === "undefined" || Address === "undefined" || Email === "undefined" || Password === "undefined" || Country === "undefined" || Pincode === "undefined" || PhoneNumber === "undefined" || cpassword === "undefined") {
          return res.status(202).json({ error: "plz filled the field property" });
     }
     else if (Password != cpassword) {
          return res.status(202).json({ error: "password not match" });
     }
     else {
          try {
               // email is present before or not
               const r = await c_register.findOne({ Email: Email });
               if (r) {
                    return res.status(202).json({ error: 'Email alredy exists' });
               }
          } catch (e) {
               console.log(e);
          }
     }

     //const { FirstName, LastName, Address, Email, Password, Country, Pincode, PhoneNumber, cpassword } = req.body;
     const customer = new c_register({ FirstName, LastName, Address, Email, Password, Country, Pincode, PhoneNumber, Profile });
     customer.save();
     return res.status(201).json({ message: 'customer register successfully' });


}
const caccount = async (req, res) => {
     var cname = localStorage.getItem('loginC');
     var id = localStorage.getItem('cid');
     if (!id) {
          return res.status(201).json({ "pname": null });
     }
     else {
          try {
               const getstudent = await c_register.find({ _id: id });
               console.log(getstudent);
               return res.status(200).send(getstudent);
          }
          catch (e) {
               return res.status(400).send(e);
          }
     }


}
const clogout = async (req, res) => {
     localStorage.removeItem('ctoken');
     localStorage.removeItem('loginC');
     localStorage.removeItem('cid');
     return res.status(201).json({ "message": "customer logout successfull" });
     // req.session.destroy(function (err) {
     //      sess = {};
     //      return res.status(201).json({ "message": "customer logout successfull" });
     // })

}
const uprofileDPC = async (req, res) => {
     const Profile = req.file.filename;
     const { FirstName, LastName, Address, Email, Country, Pincode, PhoneNumber } = req.body;
     const _id = req.body._id;
     try {
          const profiled = {
               Profile: Profile,
               FirstName: FirstName,
               LastName: LastName,
               Address: Address,
               Email: Email,
               Country: Country,
               Pincode: Pincode,
               PhoneNumber: PhoneNumber,
          }
          const updateProfile = await c_register.findByIdAndUpdate(_id, profiled);
          return res.status(200).send(updateProfile);
     }
     catch (e) {
          console.log(e);
     }

}
const allpainter = async (req, res) => {
     const u = await p_register.find({});
     if (u) {
          return res.send(u);
     }
     else {
          return res.send("painter not available");
     }

}
const p_detail = async (req, res) => {
     const id = req.params.id;
     try {
          const getstu = await p_register.findById({ _id: id });
          return res.status(200).send(getstu);

     }
     catch (e) {
          console.log(e);
     }

}
const p_imgdetail = async (req, res) => {
     const id = req.params.id;
     console.log("dd");
     try {
          const getstu = await uploadP.find({ PID: id });
          return res.status(200).send(getstu);
     }
     catch (e) {
          console.log(e);
     }

}
const findimg = async (req, res) => {
     const id = req.params.id;
     if (id === '1') {
          var figur = await uploadP.find({
               $or:
                    [{ Imgtype: "Couple,Romantic,Love Paintings" },
                    {
                         $or: [{ Imgtype: "Women,Lady,feminine Paintings" },
                         {
                              $or: [{ Imgtype: "Fashion,Glamour Paintings" },
                              {
                                   $or: [{ Imgtype: "Tribal,African Paintings" },
                                   {
                                        $or: [{ Imgtype: "Mother & Bady,Baby Paintings" },
                                        { Imgtype: "Nude,Anatomy Paintings" }]
                                   }]
                              }]
                         }]
                    }]
          });
          try {
               if (figur) {
                    return res.send(figur);
               }
               else {
                    return res.send("not found");
               }
          }
          catch (e) {
               console.log(e);
          }

     }
     else if (id === '2') {
          var lands = await uploadP.find({
               $or:
                    [{ Imgtype: "Nature,Forest,Scenery Paintings" },
                    {
                         $or: [{ Imgtype: "Ship,Sea,Beach Paintings" },
                         {
                              $or: [{ Imgtype: "City Paintings" },
                              {
                                   $or: [{ Imgtype: "Tree,Botanical Paintings" },
                                   {
                                        $or: [{ Imgtype: "Sunrise,Sunset,Rising Sun Paintings" },
                                        { Imgtype: "Walkway,Road Paintings" }]
                                   }]
                              }]
                         }]
                    }]
          });
          try {
               if (lands) {
                    return res.send(lands);
               }
               else {
                    return res.send("not found");
               }
          }
          catch (e) {
               console.log(e);
          }
     }
     else if (id === '3') {
          var lands = await uploadP.find({
               $or:
                    [{ Imgtype: "Rural,Village Paintings" },
                    {
                         $or: [{ Imgtype: "Rajasthan,Rajasthani Paintings" },
                         {
                              $or: [{ Imgtype: "Traditional,Ethnic,Folk,Tribal Paintings" },
                              { Imgtype: "Temples,Forts,Monuments Paintings" }
                              ]
                         }]
                    }]
          });
          try {
               if (lands) {
                    return res.send(lands);
               }
               else {
                    return res.send("not found");
               }
          }
          catch (e) {
               console.log(e);
          }

     }
     else if (id === '4') {
          var lands = await uploadP.find({
               $or:
                    [{ Imgtype: "Horses Paintings" },
                    {
                         $or: [{ Imgtype: "Wildlife Paintings" },
                         {
                              $or: [{ Imgtype: "Elephant Paintings" },
                              {
                                   $or: [{ Imgtype: "Birds Paintings" },
                                   {
                                        $or: [{ Imgtype: "Fishes Paintings" },
                                        { Imgtype: "Dog Paintings" }]
                                   }]
                              }]
                         }]
                    }]
          });
          try {
               if (lands) {
                    return res.send(lands);
               }
               else {
                    return res.send("not found");
               }
          }
          catch (e) {
               console.log(e);
          }
     }
     else if (id === '5') {
          var lands = await uploadP.find({
               $or:
                    [{ Imgtype: "Buddha Paintings" },
                    {
                         $or: [{ Imgtype: "Shiva,Mahadev,Parvati Paintings" }, {
                              $or: [{ Imgtype: "Krishana,Radha Krishna Paintings" },
                              {
                                   $or: [{ Imgtype: "Ganesha,Ganpati Paintings" },
                                   { Imgtype: "Jesus christ,Last supper,Mother Mary Paintings" }
                                   ]
                              }]
                         }]
                    }]
          });
          try {
               if (lands) {
                    return res.send(lands);
               }
               else {
                    return res.send("not found");
               }
          }
          catch (e) {
               console.log(e);
          }
     }
     else if (id === '6') {
          var lands = await uploadP.find({
               $or:
                    [{ Imgtype: "Pure Absract Paintings" },
                    {
                         $or: [{ Imgtype: "Geometric Absract Paintings" },
                         { Imgtype: "Other Type" }
                         ]
                    }]
          });
          try {
               if (lands) {
                    return res.send(lands);
               }
               else {
                    return res.send("not found");
               }
          }
          catch (e) {
               console.log(e);
          }
     }
     else {
          return res.send([]);
     }
}
const addcart = async (req, res, next) => {
     var imgid = req.params.id;
     var id = localStorage.getItem('cid');
     if (!id) {
          return res.status(201).json({ "pname": null });
     }
     else {
          const imgdata = await uploadP.findById({ _id: imgid });
          var addDetails = new addSchema({
               CID: id,
               Products: [{
                    product_Id: imgdata._id,
                    imagename: imgdata.Profile,
                    imageType: imgdata.Imgtype,
                    ArtName: imgdata.Artname,
                    Rprice: imgdata.Dprice,
                    Size: imgdata.Size,
                    Medium: imgdata.Medium,
                    Surface: imgdata.Surface,
                    CreatedIn: imgdata.Year,
                    qty: 1,
               }],

          });
          addDetails.save();
          return res.status(200).send("data save sucsessfully");
     }
}
const findcart = async (req, res) => {
     var id = localStorage.getItem('cid');
     if (id) {
          const data = await addSchema.find({});
          return res.status(200).send(data);
     }
     else {
          return res.status(201).send("no");
     }

}
const cartdelete = async (req, res) => {
     var imgid = req.params.id;
     const data = await addSchema.findByIdAndDelete({ _id: imgid });
     if (data) {
          return res.status(200).send(data);
     }
     else {
          return res.status(201).send("somthing wrong");
     }
}
const qtyg = async (req, res) => {
     var _id = req.params.id;
     const co = await addSchema.find({ _id });
     const c = ++(co[0].Products[0].qty);
     const data = {
          Products: [{
               product_Id: co[0].Products[0].product_Id,
               imagename: co[0].Products[0].imagename,
               imageType: co[0].Products[0].imageType,
               ArtName: co[0].Products[0].ArtName,
               Rprice: co[0].Products[0].Rprice,
               Size: co[0].Products[0].Size,
               Medium: co[0].Products[0].Medium,
               Surface: co[0].Products[0].Surface,
               CreatedIn: co[0].Products[0].CreatedIn,
               qty: c,
          }],
     }
     const imgdata = await addSchema.findByIdAndUpdate(_id, data);

     return res.status(200).send(imgdata);

}
const qty1 = async (req, res) => {
     var _id = req.params.id;
     const co = await addSchema.find({ _id });
     if (co[0].Products[0].qty > 1) {
          const c = --(co[0].Products[0].qty);
          const data = {
               Products: [{
                    product_Id: co[0].Products[0].product_Id,
                    imagename: co[0].Products[0].imagename,
                    imageType: co[0].Products[0].imageType,
                    ArtName: co[0].Products[0].ArtName,
                    Rprice: co[0].Products[0].Rprice,
                    Size: co[0].Products[0].Size,
                    Medium: co[0].Products[0].Medium,
                    Surface: co[0].Products[0].Surface,
                    CreatedIn: co[0].Products[0].CreatedIn,
                    qty: c,
               }],
          }
          const imgdata = await addSchema.findByIdAndUpdate(_id, data);
          return res.status(200).send(imgdata);

     }
     else {
          return res.status(201).send("qtr not decriese");
     }

}
const Cfpass = async (req, res) => {
     console.log(req.body);
     const { Email, Password } = req.body;
     console.log(Email);
     console.log(Password);
     const match = await c_register.findOne({ Email });
     console.log(match);
     if (!match) {
          return res.status(202).send("Email not match");
     }
     else {
          const _id = match._id;
          const pass = bc.hashSync(Password, 12);
          console.log(pass);
          const data = await c_register.findByIdAndUpdate(_id, { Password: pass, Pincode: "20000" });
          if (data) {
               return res.status(200).json("Password Updated");
          }
          else {
               return res.status(202).json("Password not Updated");
          }

     }
}
const Pfpass = async (req, res) => {
     console.log(req.body);
     const { Email, Password } = req.body;
     console.log(Email);
     console.log(Password);
     const match = await p_register.findOne({ Email });
     console.log(match);
     if (!match) {
          return res.status(202).send("Email not match");
     }
     else {
          const _id = match._id;
          const pass = bc.hashSync(Password, 12);
          console.log(pass);
          const data = await p_register.findByIdAndUpdate(_id, { Password: pass });
          if (data) {
               return res.status(200).json("Password Updated");
          }
          else {
               return res.status(202).json("Password not Updated");
          }

     }
}
const findimgdata = async (req, res) => {
     const d = await uploadP.find({});
     if (d) {
          return res.status(200).send(d);
     }
     else {
          return res.status(201).send("data not found ");
     }
}


const uprofileDC = async (req, res) => {
     const { FirstName, LastName, Address, Email, Country, Pincode, PhoneNumber } = req.body;
     console.log(req.body);
     const _id = req.body._id;
     console.log(req.body._id + " === " + _id);
     try {
          const profiled = {
               FirstName: FirstName,
               LastName: LastName,
               Address: Address,
               Email: Email,
               Country: Country,
               Pincode: Pincode,
               PhoneNumber: PhoneNumber,
          }
          const updateProfile = await c_register.findByIdAndUpdate(_id, profiled);
          return res.status(200).send(updateProfile);
     }
     catch (e) {
          console.log(e);
     }

}

module.exports = {
     paccount,
     plogin,
     pregister,
     plogout,
     addp,
     uprofileD,
     uprofileDP,
     getimg,
     upaintingD,
     imglist,
     delimg,
     upaintingDP,
     Clogin,
     cretister,
     caccount,
     clogout,
     uprofileDPC,
     allpainter,
     p_detail,
     p_imgdetail,
     findimg,
     addcart,
     findcart,
     cartdelete,
     qtyg,
     qty1,
     Cfpass,
     Pfpass,
     findimgdata,
     uprofileDC,
}