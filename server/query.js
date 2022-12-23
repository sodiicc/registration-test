exports.create_user =
'INSERT INTO public.user( name, email, password) VALUES ($1, $2, $3);'

exports.set_avatar =
'UPDATE public.user SET avatar = ($2) WHERE email = ($1);'

exports.get_user_info =
'SELECT * FROM public.user WHERE email = ($1);'

exports.login =
'SELECT * FROM public.user WHERE email = ($1) AND password = ($2);'
