function tablesearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("listTable");
    tr = table.getElementsByTagName("tr");
    // console.log( "input : " , input ,'filter : ' , filter ,'tr : ' , tr);

      for (i = 0; i < tr.length; i++) {
        tx = tr[i].getElementsByTagName("td");
        for(j=0;j < tx.length-1 ; j++){
            td = tr[i].getElementsByTagName("td")[j];


        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            // console.log(txtValue);
            break;
          } else {

            tr[i].style.display = "none";
          }
        }       
      }
    }

}
