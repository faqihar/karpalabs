var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'Pengguna SIM', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: 'Pengguna SIM', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add User SIM',
		nama: '',
		alamat: '',
		Tempat_lahir: '',
		tgl_lahir: '',
		tinggi: '',
		pekerjaan: '',
		No_sim: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next) {	
	req.assert('nama', 'Nama is required').notEmpty()           //Validate name
	req.assert('alamat', 'alamat is required').notEmpty()             //Validate age
	req.assert('Tempat_lahir', 'tempat lahir is required').notEmpty()  //Validate email
	req.assert('tgl_lahir', 'tanggal lahir is required').notEmpty()
	req.assert('tinggi', 'tinggi is required').notEmpty()
	req.assert('pekerjaan', 'tempat lahir is required').notEmpty()
	req.assert('No_sim', 'tempat lahir is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			nama: req.sanitize('nama').escape().trim(),
			alamat: req.sanitize('alamat').escape().trim(),
			Tempat_lahir: req.sanitize('Tempat_lahir').escape().trim(),
			tgl_lahir: req.sanitize('tgl_lahir').escape().trim(),
			tinggi: req.sanitize('tinggi').escape().trim(),
			pekerjaan: req.sanitize('pekerjaan').escape().trim(),
			No_sim: req.sanitize('No_sim').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO users SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New User',
						nama: user.nama,
						alamat: user.alamat,
						Tempat_lahir: user.Tempat_lahir,
						tgl_lahir: user.tgl_lahir,
						tinggi: user.tinggi,
						pekerjaan: user.pekerjaan,
						No_sim: user.No_sim					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New User',
						nama: '',
						alamat: '',
						Tempat_lahir: '',
						tgl_lahir: '',
						tinggi: '',
						pekerjaan: '',
						No_sim: ''					
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New User',
            nama: req.body.nama,
			alamat: req.body.alamat,
			Tempat_lahir: req.body.Tempat_lahir,
			tgl_lahir: req.body.tgl_lahir,
			tinggi: req.body.tinggi,
			pekerjaan: req.body.pekerjaan,
			No_sim: req.body.No_sim

        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: 'Edit User', 
					//data: rows[0],
					id: rows[0].id,
					nama: rows[0].nama,
					alamat: rows[0].alamat,
					Tempat_lahir: rows[0].Tempat_lahir,
					tgl_lahir: rows[0].tgl_lahir,
					tinggi: rows[0].tinggi,
					pekerjaan: rows[0].pekerjaan,
					No_sim: rows[0].No_sim				
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('nama')           //Validate name
	req.assert('alamat')            //Validate age
	req.assert('Tempat_lahir')  //Validate email
	req.assert('tgl_lahir')
	req.assert('tinggi')
	req.assert('pekerjaan')
	req.assert('No_sim')

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			nama: req.sanitize('nama').escape().trim(),
			alamat: req.sanitize('alamat').escape().trim(),
			Tempat_lahir: req.sanitize('Tempat_lahir').escape().trim(),
			tgl_lahir: req.sanitize('tgl_lahir').escape().trim(),
			tinggi: req.sanitize('tinggi').escape().trim(),
			pekerjaan: req.sanitize('pekerjaan').escape().trim(),
			No_sim: req.sanitize('No_sim').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						nama: req.body.nama,
						alamat: req.body.alamat,
						Tempat_lahir: req.body.Tempat_lahir,
						tgl_lahir: req.body.tgl_lahir,
						tinggi: req.body.tinggi,
						pekerjaan: req.body.pekerjaan,
						No_sim: req.body.No_sim
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						nama: req.body.nama,
						alamat: req.body.alamat,
						Tempat_lahir: req.body.Tempat_lahir,
						tgl_lahir: req.body.tgl_lahir,
						tinggi: req.body.tinggi,
						pekerjaan: req.body.pekerjaan,
						No_sim: req.body.No_sim

						
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			nama: req.body.nama,
			alamat: req.body.alamat,
			Tempat_lahir: req.body.Tempat_lahir,
			tgl_lahir: req.body.tgl_lahir,
			tinggi: req.body.tinggi,
			pekerjaan: req.body.pekerjaan,
			No_sim: req.body.No_sim
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
