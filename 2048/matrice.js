/**
 * @author Manu
 */

var TAILLE_MATRICE = 4;
var entier = ( typeof Int32Array != 'undefined');

function Matrix() {
	// on cree un vecteur avec toutes les valeurs Ã  0
	var matrice = Array.prototype.concat.apply([], arguments);
	var score = Array.prototype.concat.apply([], arguments);

	if (!matrice.length) {

		for (var i = 0; i < TAILLE_MATRICE * TAILLE_MATRICE; i++)
			matrice.push(0);

	}

	if (!score.length) {
		score.push(0);
	}
	//alert(typeof m);

	this.matrice = entier ? new Int32Array(matrice) : matrice;
	this.score = entier ? new Int32Array(score) : score;
}

Matrix.prototype = {

	// renvoie vrai si il n'a pas de valeur null dans la matrice
	_MatriceRemplie : function() {

		// determination de la cellule Ã  remplir
		for (var i = 0; i < this.matrice.length; i++) {
			//alert("valeur de la matrice " + this.matrice[i] );
			if (this.matrice[i] == 0)
				return false;
		}
		//alert("Matrice remplie : vrai");
		return true;

	},

	// renvoie vrai si la matrice membre et la matrice en argument sont égale
	_MatriceEgale : function(mat) {

		for (var i = 0; i < this.matrice.length; i++) {
			if (this.matrice[i] != mat[i]) {
				return false;
			}
		}
		return true;

	},

	// renvoie vrai si la matrice a au moins une fusion possible
	_FusionPossible : function() {
		var retour = false;

		// on recherche deux valeurs cote à cote dans les lignes
		for (var lig = 0; lig < TAILLE_MATRICE - 1; lig++)
			for (var col = 0; col < TAILLE_MATRICE; col++)
				if (this.matrice[lig + col * TAILLE_MATRICE] == this.matrice[lig + 1 + col * TAILLE_MATRICE])
					retour = true;

		// on rrecommance pour les colonnes
		for (var col = 0; col < TAILLE_MATRICE - 1; col++)
			for (var lig = 0; lig < TAILLE_MATRICE; lig++)
				if (this.matrice[lig + col * TAILLE_MATRICE] == this.matrice[lig + (col + 1) * TAILLE_MATRICE])
					retour = true;

		return retour;

	},

	// fait faire a la matrice 1/4 de tour dans le sens anti-horaire
	Rotation : function() {
		var result = new Matrix();

		for (var lig = 0; lig < TAILLE_MATRICE; ++lig) {
			for (var col = 0; col < TAILLE_MATRICE; ++col) {
				result.matrice[lig + col * TAILLE_MATRICE] = this.matrice[(TAILLE_MATRICE - col - 1) + lig * TAILLE_MATRICE];
			}
		}

		// on applique la matrice
		this.matrice = result.matrice;
	},

	// ajoute une nouvelle valeur -2 ou -4 dans une cellule vide
	// return vrai si OK, faux si il n'y a pas de cellule vide poru ajouter une valeur.
	// test fin de partie
	PopCase : function() {

		if (this._MatriceRemplie()) {
			//alert("Matrice remplie");
			return false;
		}

		var celluleVide = [];

		// determination de la cellule Ã  remplir
		for (var i = 0; i < this.matrice.length; i++) {
			if (this.matrice[i] == 0)
				celluleVide.push(i);
		}

		var indiceCelluleVide = Math.floor(Math.random() * celluleVide.length);

		// determination de la valeur Ã  ajouter 2 ou 4

		var valeurAjoute = Math.pow(2, Math.floor(Math.random() * 2) + 1);
		//alert( Math.floor(Math.random() *2));

		this.matrice[celluleVide[indiceCelluleVide]] = -valeurAjoute;

		// on test pour voir si il y a un mouvement possible

		return true;

	},

	Mouvement : function() {

		var copieLocal = [];

		for (var i = 0; i < TAILLE_MATRICE * TAILLE_MATRICE; i++)
			copieLocal.push(this.matrice[i]);

		if (this.MergeGravite() == true) {
			alert("vous avez gagné.\n Votre score est de " + this.Score());
		}

		// pas de changement de la matrice = > pas de pop
		if (this._MatriceEgale(copieLocal)) {
			return true;
		}

		if (this.PopCase() == false) {
			return false;

		}
		
		if (this._FusionPossible() == false & this._MatriceRemplie()) {
			return false;

		}

	},

	MergeGravite : function() {

		var partieGagne = false;

		for (var col = 0; col < TAILLE_MATRICE; col++) {

			var ValeurNonVideColonne = new Array();

			// on recupere les cellules non vide par colonne
			for (var lig = TAILLE_MATRICE - 1; lig >= 0; lig--)
				if (this.matrice[lig * TAILLE_MATRICE + col] != 0)
					ValeurNonVideColonne.push(this.matrice[lig * TAILLE_MATRICE + col]);

			//alert("Nombre de valeur non vide de la colonne " + col + " : " +ValeurNonVideColonne.length );

			// on vide toutes les cellules de la colonne
			for (var lig = 0; lig < TAILLE_MATRICE; lig++)
				this.matrice[lig * TAILLE_MATRICE + col] = 0;

			//alert("Les valeurs non nulls sont : " +ValeurNonVideColonne);

			// on rempli avec les valeurs non null en les fusionnant
			var ligneValeurInser = TAILLE_MATRICE - 1;
			var valeurInserer;
			for (var indiceValeurNonNulle = 0; indiceValeurNonNulle < ValeurNonVideColonne.length; indiceValeurNonNulle++) {
				// si la valeur n'est pas la dernier de la liste et que la valeur suivante est Ã©gale
				if ((indiceValeurNonNulle < ValeurNonVideColonne.length - 1) && (ValeurNonVideColonne[indiceValeurNonNulle] == ValeurNonVideColonne[indiceValeurNonNulle + 1])) {
					//on double la valeur
					valeurInserer = ValeurNonVideColonne[indiceValeurNonNulle] * 2;
					//on saute la valeur suivante (fusion)
					indiceValeurNonNulle++;
					// on ajoute le score
					this.score[0] += valeurInserer;
				} else
					// sinon la valeur n'est pas fusionnÃ©e
					valeurInserer = ValeurNonVideColonne[indiceValeurNonNulle];

				// on insere la valeur en partant du bas de la matrice
				this.matrice[(ligneValeurInser) * TAILLE_MATRICE + col] = valeurInserer;
				ligneValeurInser--;

				// on fini la fusion meme si la partie est gagné
				if (valeurInserer == 2048) {
					partieGagne = true;

				}
			}

		}

		return partieGagne;

	},

	// renvoie la matrice sous forme de texte
	Affichage : function() {
		var valeurCellule;
		var nom;
		var baliseP;
		var baliseTd;

		for (var cellule = 0; cellule < TAILLE_MATRICE * TAILLE_MATRICE; cellule++) {
			nom = "case" + cellule;
			baliseP = document.getElementById(nom);
			baliseTd = baliseP.parentNode;
			valeurCellule = this.matrice[cellule];

			if (valeurCellule > 0)
				baliseP.innerHTML = this.matrice[cellule];
			else if (valeurCellule == 0)
				baliseP.innerHTML = " ";
			else
				baliseP.innerHTML = -this.matrice[cellule];

			switch(valeurCellule) {
			case -2:
			case -4:
				{
					baliseTd.className = "animationNewCell";
					baliseP.className = "size01";
					this.matrice[cellule] = -this.matrice[cellule];
				}
				break;
			case 0:
				{
					baliseTd.className = "grisflat";
					baliseP.className = "size01";
				}
				break;
			case 2:
			case 4:
				{
					baliseTd.className = "vert";
					baliseP.className = "size01";
				}
				break;
			case 8:
			case 16:
				{
					baliseTd.className = "bleu";
					baliseP.className = "size01";
				}
				break;
			case 32:
			case 64:
				{
					baliseTd.className = "orange";
					baliseP.className = "size01";
				}
				break;
			case 128:
			case 256:
			case 512:
				{
					baliseTd.className = "violet";
					baliseP.className = "size02";
				}
				break;
			case 1024:
			case 2048:
				{
					baliseTd.className = "rouge";
					baliseP.className = "size03";
				}
				break;

			case 4096:
			case 5192:
			case 16384:
			case 32768:
				{
					baliseTd.className = "gris";
					baliseP.className = "size03";
				}
				break;
			default:
				{
					baliseTd.className = "grisflat";
					baliseP.className = "size03";
				}
				break;
			}
		}
	},

	// renvoie le score
	Score : function() {

		//return "Votre score est de : <span class=\"scoreNombre\">" + this.score[0] + "</span>";
		return this.score[0];

	}
};

//*****************************
// Manipulation de la matrice
//*****************************

var matrice;

function NouvelleGrille() {

	matrice = new Matrix();

	matrice.PopCase();
	matrice.PopCase();

	matrice.Affichage();
	document.getElementById("resultat").innerHTML = matrice.Score();
}

function MouvementBas() {
	//document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	var retour = matrice.Mouvement();

	matrice.Affichage();
	
	affichageText(retour);
}

function MouvementHaut() {
	//document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	matrice.Rotation();
	matrice.Rotation();

	var retour = matrice.Mouvement();

	matrice.Rotation();
	matrice.Rotation();

	matrice.Affichage();
	
	affichageText(retour);
}

function MouvementGauche() {
	// document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	matrice.Rotation();

	var retour = matrice.Mouvement();

	matrice.Rotation();
	matrice.Rotation();
	matrice.Rotation();

	matrice.Affichage();
	
	affichageText(retour);
}

function MouvementDroite() {
	// document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	matrice.Rotation();
	matrice.Rotation();
	matrice.Rotation();

	var retour = matrice.Mouvement();

	matrice.Rotation();

	matrice.Affichage();
	
	affichageText(retour);
}

function affichageText(retour){
	
	if(retour == false)
		alert("Vous avez perdu... Votre score est de " + matrice.Score());
	else
		document.getElementById("resultat").innerHTML = matrice.Score();
}

function touchePressee(event) {
	var key = event.keyCode;

	if (key == 38)
		MouvementHaut();
	else if (key == 37)
		MouvementGauche();
	else if (key == 39)
		MouvementDroite();
	else if (key == 40)
		MouvementBas();

}
