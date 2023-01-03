const Hottie = require("../models/hottie");
var fs = require('fs');
var path = require('path');

// home page, shows all hottie pics and full name
exports.index = (req, res, next) => {
    Hottie.find({}, "firstName lastName img", (err, hotties) => {
        if (err) {
            return next(err);
        }
        else {
            res.render("index", { title: "Hotties", hotties: hotties} );
        }
    });
};

// Display list of all hotties (just text)
exports.hottieList = (req, res, next) => {
    Hottie.find({}, "firstName lastName").sort({lastName: 1}).exec((err, hotties) => {
        if (err) {
            next(err);
        }
        else {
            res.render("hottieList", { hotties: hotties });
        }
    });
};
  
// Display detail page for a specific hottie.
exports.hottieDetail = (req, res, next) => {
    Hottie.findById(req.params.id, (err, hottie) => {
        if (err) {
            return next(err);
        }
        else {
            res.render("hottieDetail", {hottie: hottie});
        }
    })
};

// Display hottie create form on GET.
exports.hottieCreate_get = (req, res) => {
    res.render("hottieCreate", { title: "Create Hottie" });
};

// Handle hottie create on POST.
exports.hottieCreate_post = (req, res) => {

    // make new hottie with form info
    const hottie = new Hottie({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        desc: req.body.desc,
        from: req.body.from,
        img: {
            //data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            data: fs.readFileSync(req.file.path),
            contentType: 'image/png'
        }
    });
    
    // save to database
    hottie.save((err) => {
        if (err) {
            return next(err);
        }
        else {
            res.redirect(hottie.url);
        }
    });

    // delete it from uploads folder (don't want it clogging up)
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('removed')
        }
    });

};

// Display hottie delete form on GET.
exports.hottieDelete_get = (req, res) => {
    Hottie.findById(req.params.id, (err, hottie) => {
        if (err) {
            next(err);
        }
        else {
            res.render("hottieDelete", { hottie: hottie})
        }
    });
};

// Handle hottie delete on POST.
exports.hottieDelete_post = (req, res) => {
    Hottie.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            next(err);
        }
        else {
            res.redirect("/hotties");
        }
    });
};

// Display hottie update form on GET.
exports.hottieUpdate_get = (req, res, next) => {
    Hottie.findById(req.params.id, (err, hottie) => {
        if (err) {
            next(err);
        }
        else {
            res.render("hottieUpdate", {hottie: hottie});
        }
    });
};

// Handle hottie update on POST.
exports.hottieUpdate_post = (req, res, next) => {

    // try to find id
    Hottie.findById(req.params.id, (err, hottieInDb) => {
        if (err) {
            return next(err);
        }
        else {
            // if hottie found in database, create updated hottie with NEW info
            const hottie = new Hottie({
                firstName: req.body.firstName === undefined ? hottieInDb.firstName : req.body.firstName,
                lastName: req.body.lastName === undefined ? hottieInDb.lastName : req.body.lastName,
                desc: req.body.desc === undefined ? hottieInDb.desc : req.body.desc,
                from: req.body.from === undefined ? hottieInDb.from : req.body.from,
                img: {
                    data: req.file === undefined ? hottieInDb.img.data : fs.readFileSync(req.file.path),
                    contentType: 'image/png'
                },
                _id: req.params.id
            });
        
            // update hottie
            Hottie.findByIdAndUpdate(req.params.id, hottie, {}, (err, hottie) => {
                if (err) {
                    return next(err);
                }
                else {
                    res.redirect(hottie.url);
                }
            });

            // delete new photo from uploads folder (if there)
            if (req.file !== undefined) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('removed')
                    }
                });
            }
        }
    });
};