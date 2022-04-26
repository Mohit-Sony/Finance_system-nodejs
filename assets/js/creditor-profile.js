let form_credit_init = document.getElementById('credit-init-form');
let type_field = document.getElementById('credit_type');
let type_value = type_field.value;
let amount_to_return_div = document.getElementById('amount-div');
let intrest_rate = document.getElementById('intrest-rate-div');
let return_date = document.getElementById('return-date-div');
let installment_type = document.getElementById('installment_type_div');
let submit_new_credit = document.getElementById('new-credit-form-submit');
let input_fields = document.getElementsByClassName('form-control');

function form_validation_init_payment(){
    console.log('clicked form valid');
    type_value = type_field.value;
    if(type_value == 'on_intrest_rate' ){
        console.log('1')
        submit_new_credit.setAttribute('disabled', 'true' );

    }else if((type_value == 'fixed_amount' && document.getElementById('return_date').value != "" && document.getElementById('credit-amount').value != "" &&  document.getElementById("amount_return").value != "" && (parseInt(document.getElementById('credit-amount').value) <= parseInt(document.getElementById("amount_return").value )) && document.getElementById("taken_date").value != "" && ( new Date (document.getElementById("taken_date").value) < new Date (document.getElementById('return_date').value) )  )){
        submit_new_credit.removeAttribute('disabled');
        console.log('2')


    }else{
        submit_new_credit.setAttribute('disabled', 'true' );
        console.log('3')

    }
}

function set_credit_init_form(){
    let type_value = type_field.value;
    if(type_value == 'on_intrest_rate'){
        amount_to_return_div.style.display = 'none';
        intrest_rate.style.display = 'block';
        installment_type.style.display = 'block';

    }else if(type_value == 'fixed_amount'){
        amount_to_return_div.style.display = 'block';
        intrest_rate.style.display = 'none';
        installment_type.style.display = 'none';
    }

    console.log(type_value);

}
type_field.addEventListener('change',function(){
    set_credit_init_form();
})

for(let field of input_fields){
    field.addEventListener('input', function(){
        // event.preventDefault();
        // alert('clicked');
        console.log('click');
        form_validation_init_payment();
    })
};
document.getElementById('credit_type').addEventListener('change',function(){
    console.log('change');
    form_validation_init_payment();

})



set_credit_init_form();