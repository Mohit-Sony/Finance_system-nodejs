let form_debit_init=document.getElementById("debit-init-form"),type_field=document.getElementById("debit_type"),type_value=type_field.value,amount_to_return_div=document.getElementById("amount-div"),intrest_rate=document.getElementById("intrest-rate-div"),days_return=document.getElementById("days-return-div"),return_date=document.getElementById("return-date-div"),installment_type=document.getElementById("installment_type_div"),submit_new_debit=document.getElementById("new-debit-form-submit"),input_fields=document.getElementsByClassName("form-control"),ext_view_btn=document.getElementsByClassName("extended_view_btn"),single_debit=document.getElementsByClassName("single_debit_cont");function form_validation_init_payment(){console.log("clicked"),type_value=type_field.value,"on_intrest_rate"==type_value?(console.log("1"),submit_new_debit.setAttribute("disabled","true")):("fixed_amount"==type_value&&""!=form_debit_init.querySelector("#days").value||"holayati"==type_value&&""!=form_debit_init.querySelector("#return_date").value)&&""!=form_debit_init.querySelector("#credit-amount").value&&""!=form_debit_init.querySelector("#amount").value&&parseInt(form_debit_init.querySelector("#credit-amount").value)<=parseInt(form_debit_init.querySelector("#amount").value)&&""!=form_debit_init.querySelector("#init_date").value?(submit_new_debit.removeAttribute("disabled"),console.log("2")):(submit_new_debit.setAttribute("disabled","true"),console.log("3"),console.log("days : ",""!=form_debit_init.querySelector("#days").value,"credit amount :",form_debit_init.querySelector("#credit-amount").value,"amount",form_debit_init.querySelector("#amount").value,"init date : ",form_debit_init.querySelector("#init_date").value))}function set_debit_init_form(){let e=type_field.value;"on_intrest_rate"==e?(amount_to_return_div.style.display="none",return_date.style.display="block",intrest_rate.style.display="block",installment_type.style.display="block",days_return.style.display="none"):"fixed_amount"==e?(amount_to_return_div.style.display="block",return_date.style.display="none",intrest_rate.style.display="none",installment_type.style.display="none",days_return.style.display="block"):"holayati"==e&&(amount_to_return_div.style.display="block",return_date.style.display="block",intrest_rate.style.display="none",installment_type.style.display="none",days_return.style.display="none"),console.log(e)}console.log(form_debit_init),type_field.addEventListener("change",(function(){set_debit_init_form()}));for(let e of input_fields)e.addEventListener("input",(function(){console.log("click"),form_validation_init_payment()}));document.getElementById("debit_type").addEventListener("change",(function(){console.log("change"),form_validation_init_payment()})),console.log(ext_view_btn);for(let e=0;e<ext_view_btn.length;e++)single_debit[e].getElementsByClassName("extended_view")[0].style.display="none",ext_view_btn[e].addEventListener("click",(function(){console.log("clicked"),console.log(e),"none"==single_debit[e].getElementsByClassName("extended_view")[0].style.display?single_debit[e].getElementsByClassName("extended_view")[0].style.display="grid":single_debit[e].getElementsByClassName("extended_view")[0].style.display="none"}));set_debit_init_form();