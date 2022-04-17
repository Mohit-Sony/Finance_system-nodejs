let form_debit_init = document.getElementById('debit-init-form');
let type_field = document.getElementById('debit_type');
let type_value = type_field.value;
let amount_to_return_div = document.getElementById('amount-div');
let intrest_rate = document.getElementById('intrest-rate-div');
let days_return = document.getElementById('days-return-div');
let return_date = document.getElementById('return-date-div');
let installment_type = document.getElementById('installment_type_div');
let submit_new_debit = document.getElementById('new-debit-form-submit');
let input_fields = document.getElementsByClassName('form-control');
let ext_view_btn = document.getElementsByClassName('extended_view_btn');
let single_debit = document.getElementsByClassName('single_debit_cont');
console.log(form_debit_init);

function form_validation_init_payment(){
    console.log('clicked');
    type_value = type_field.value;
    if(type_value == 'on_intrest_rate' ){
        console.log('1')
        submit_new_debit.setAttribute('disabled', 'true' );

    }else if((type_value == 'fixed_amount' && form_debit_init.querySelector("#days").value != "" || type_value =='holayati'&& form_debit_init.querySelector('#return_date').value != "" )&&(form_debit_init.querySelector('#credit-amount').value != "" && form_debit_init.querySelector("#amount").value != "" && (parseInt(form_debit_init.querySelector('#credit-amount').value) <= parseInt(form_debit_init.querySelector("#amount").value )) && form_debit_init.querySelector("#init_date").value != ""  )){
        submit_new_debit.removeAttribute('disabled');
        console.log('2')


    }else{
        submit_new_debit.setAttribute('disabled', 'true' );
        console.log('3')
        console.log('days : ',form_debit_init.querySelector("#days").value != "", 'credit amount :',form_debit_init.querySelector('#credit-amount').value , 'amount' , form_debit_init.querySelector("#amount").value , 'init date : ',form_debit_init.querySelector("#init_date").value )

    }
}

function set_debit_init_form(){
    let type_value = type_field.value;
    if(type_value == 'on_intrest_rate'){
        amount_to_return_div.style.display = 'none';
        return_date.style.display = 'block';
        intrest_rate.style.display = 'block';
        installment_type.style.display = 'block';
        days_return.style.display = 'none';

    }else if(type_value == 'fixed_amount'){
        amount_to_return_div.style.display = 'block';
        return_date.style.display = 'none';
        intrest_rate.style.display = 'none';
        installment_type.style.display = 'none';
        days_return.style.display = 'block';



    }else if(type_value == 'holayati'){
        amount_to_return_div.style.display = 'block';
        return_date.style.display = 'block';
        intrest_rate.style.display = 'none';
        installment_type.style.display = 'none';
        days_return.style.display = 'none';

    }

    console.log(type_value);

}
type_field.addEventListener('change',function(){
    set_debit_init_form();
})

for(let field of input_fields){
    field.addEventListener('input', function(){
        // event.preventDefault();
        // alert('clicked');
        console.log('click');
        form_validation_init_payment();
    })
};
document.getElementById('debit_type').addEventListener('change',function(){
    console.log('change');
    form_validation_init_payment();

});

console.log(ext_view_btn);

for(let i = 0 ; i < ext_view_btn.length ; i++){
    single_debit[i].getElementsByClassName('extended_view')[0].style.display = 'none';
    ext_view_btn[i].addEventListener('click',function(){
        // alert('clicked')
        console.log('clicked')
        console.log(i)
        if(single_debit[i].getElementsByClassName('extended_view')[0].style.display == 'none'){
            single_debit[i].getElementsByClassName('extended_view')[0].style.display = 'grid';

        }else{
            single_debit[i].getElementsByClassName('extended_view')[0].style.display = 'none';
        }
    })
}
// console.log(ext_view_btn);

set_debit_init_form();