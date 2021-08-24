const studentModel = require('../model/student.model');

class siteController {
    Home(req, res) {
        studentModel.find()
        .then(data=>{
            res.render('index', { page: 'home', students: data });
        })
    }

    GetStudent(req, res){
        studentModel.findOne({
            studentID: req.params.id
        })
        .then((data)=>{
            if(data) res.status(200).json(data)
            else res.status(404).json('Not found')
        })
        .catch(err=>{
            res.status(500).json('Loi server')
        })
    }

    AddStudent(req, res) {
        let student = new studentModel({
            studentID: req.body.studentID,
            name: req.body.name,
            birth: req.body.birth,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone
        })
        studentModel.findOne({
            studentID: student.studentID
        })
        .then(data=>{
            if(data){
                res.status(208);
            }
            else{
                student.save();
                res.status(200).json(student)
            }
        })
        .catch(err=>{
            if(err) res.status(504).json('Loi server');
        })
    }

    DeleteStudent(req, res){
        studentModel.findOneAndDelete({
            studentID: req.params.id
        })
        .then(()=>{
            res.status(200).json('Xoa thanh cong')
        })
        .catch(()=>{
            res.status(500).json('Loi sever')
        })
    }

    UpdateStudent(req, res){
        let frm = new studentModel({
            studentID: req.body.studentID,
            name: req.body.name,
            birth: req.body.birth,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone
        })
        studentModel.findOneAndUpdate({
            studentID: req.body.studentID
        }, {
            studentID: req.body.studentID,
            name: req.body.name,
            birth: req.body.birth,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone
        })
        .then((data)=>{
            res.status(200).json({frm})
        })
        .catch(()=>{
            res.status(500).json('Loi sever')
        })
    }
}

module.exports = new siteController();