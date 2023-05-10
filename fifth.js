function show_result(){
	let ma= document.querySelector("#ma").value;
	let mk= document.querySelector("#mk").value;

let to = parseFloat(ma)+parseFloat(mk);
let per = (to*100)/100;

if(per>=80){
	document.querySelector(".gra").innerHTML = "GREEN ZONE";
}else if(per>=50){
	document.querySelector(".gra").innerHTML = "YELLOW ZONE";
}else if(per>=0){
	document.querySelector(".gra").innerHTML = "RED ZONE";
}

document.querySelector(".to").innerHTML = to;
document.querySelector(".per").innerHTML = per;

if(per>=80){
	document.querySelector(".result h2").innerHTML = "Tahniah! anda berpotensi tinggi untuk ke Universiti.";
}else if(per>=50){
	document.querySelector(".result h2").innerHTML = "Potensi anda untuk menyambung pengajian di universiti adalah sederhana.";
}else if(per>=0){
  document.querySelector(".result h2").innerHTML = "Tingkatkan usaha untuk layak ke universiti."
}
}