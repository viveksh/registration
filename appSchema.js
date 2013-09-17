function make(Schema,mongoose,forms) {
	var userSchema = new Schema({
	  username: { type: String, required: true, unique: true, forms: {all: {}}},
	  password: { type: String, required: true, forms: {all: {}}},
	  confirm: { type: String, forms: {all: {}}},
	  email: { type: String, required: true, forms: {all: {}}}
	});

	// add methods
	userSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
	};
	// initialization of schema
	userModel = mongoose.model('User',userSchema);
}
module.exports.make = make;