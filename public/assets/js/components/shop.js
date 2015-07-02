var categories = {};
var cart_count = 0;

$('.product__choice').on('click', function(){
	var category = $(this).attr('name');
	var data = {};
		data.id = category;
		data.name = $(this).attr('data-item') + " ("+ category +")";
		data.price = parseInt($(this).val());

	if( category in categories) {
		delete categories[category];
		$.publish('cart.removed', data.id);
		cart_count--;
	}
	
	categories[category] = data.name;
	$.publish('cart.added', data);
	cart_count++;

	updateCartCount();
});

$('.product__option').on('click', function(){
	var category = $(this).attr('name');
	var data = {};
		data.id = $(this).attr('data-id');
		data.name = $(this).attr('data-item') + " ("+ category +")";
		data.price = parseInt($(this).val());

	if($(this).prop('checked')) {
		$.publish('cart.added', data);
		cart_count++;
	} else {
		$.publish('cart.removed', data.id);
		cart_count--;
	}

	updateCartCount();
	
});

function updateCartCount(){
	$('.cart_count').html(cart_count);
}