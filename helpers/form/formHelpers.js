function formHelper(forms,fields,validators) {
	var reg_form = forms.create({
	    username: fields.string({required: true}),
	    password: fields.password({required: true}),
	    confirm:  fields.password({
	        required: true,
	        validators: [validators.matchField('password')]
	    }),
	    email: fields.email()
	});

	regForm = reg_form
}
module.exports.formHelper = formHelper;