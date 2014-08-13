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
			if (this.matrice[i] == 0) {
				return false;
			}
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
	_FusionImpossible : function() {

		// on recherche deux valeurs cote à cote dans les lignes différente de 0.
		for (var lig = 0; lig < TAILLE_MATRICE - 1; lig++)
			for (var col = 0; col < TAILLE_MATRICE; col++) {
				//console.log("lig:col = " + lig + ":"+ col + " valeur = " + this._Valeur(lig, col) + " valeur lignesuivante :" + this._Valeur(lig+1, col)  );
				if ((0 != this._Valeur(lig, col)) & (Math.abs(this._Valeur(lig, col)) == Math.abs(this._Valeur(lig + 1, col))))
					return false;
			}
		// on rrecommance pour les colonnes
		for (var col = 0; col < TAILLE_MATRICE - 1; col++)
			for (var lig = 0; lig < TAILLE_MATRICE; lig++) {
				//console.log("lig:col = " + lig + ":"+ col + " valeur = " + this._Valeur(lig, col) + " valeur colonesuivante :" + this._Valeur(lig, col+1)  );
				if ((0 != this._Valeur(lig, col)) & (Math.abs(this._Valeur(lig, col)) == Math.abs(this._Valeur(lig, col + 1))))
					return false;
			}
		//alert("fusion impossible");
		return true;

	},

	_CaseSuperieur2048 : function() {

		for (var i = 0; i < this.matrice.length; i++) {
			if (this.matrice[i] >= 2048) {
				return true;
			}
		}
		return false;

	},

	AffecterValeur : function(ligne, colonne, valeur) {
		this.matrice[ligne + colonne * TAILLE_MATRICE] = valeur;

	},

	_Valeur : function(ligne, colonne) {
		if (ligne >= TAILLE_MATRICE || colonne >= TAILLE_MATRICE) {
			alert("Erreur de demande de valeur à la matrice.");
			return -1;
		}
		// pour traité les valeur négative (case pop)
		return Math.abs(this.matrice[ligne + colonne * TAILLE_MATRICE]);
	},

	// fait faire a la matrice 1/4 de tour dans le sens anti-horaire
	Rotation : function() {
		var result = new Matrix();

		for (var lig = 0; lig < TAILLE_MATRICE; ++lig) {
			for (var col = 0; col < TAILLE_MATRICE; ++col) {
				result.AffecterValeur(lig, col, this._Valeur(TAILLE_MATRICE - col - 1, lig));
				//this.matrice[(TAILLE_MATRICE - col - 1) + lig * TAILLE_MATRICE];
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
			//alert("popsace : matrice remplie");
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

		return (!(this._FusionImpossible() & this._MatriceRemplie()));

	},

	Mouvement : function() {

		var copieLocal = [];

		for (var i = 0; i < this.matrice.length; i++)
			copieLocal.push(this.matrice[i]);

		var caseSup = this._CaseSuperieur2048();

		if (this.MergeGravite() == true && caseSup == false) {

			affichageText("GAGNE");
		}

		// pas de changement de la matrice = > pas de pop
		if (this._MatriceEgale(copieLocal)) {
			return true;
		}

		return (this.PopCase() == false ? "PERDU" : "CONTINUE");

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
					baliseTd.className = "violet";
					baliseP.className = "size01";
				}
				break;
			case 128:
			case 256:
			case 512:
				{
					baliseTd.className = "orange";
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

var maMatrice;
var matriceVide = new Matrix();

function NouvelleGrille() {

	maMatrice = new Matrix();

	maMatrice.PopCase();
	maMatrice.PopCase();

	matriceVide.Affichage();
	maMatrice.Affichage();
	document.getElementById("resultat").innerHTML = maMatrice.Score();


	document.getElementById("Message").className = "Cache";
	document.getElementById("Continue").className = "Cache";

	document.getElementById("fg").className = "Affiche";
	document.getElementById("hb").className = "Affiche";
	document.getElementById("fd").className = "Affiche";

}

function MouvementBas() {
	//document.getElementById("maMatrice").innerHTML = maMatrice.MatriceTexte();

	var retour = maMatrice.Mouvement();

	maMatrice.Affichage();

	affichageText(retour);

}

function MouvementHaut() {
	//document.getElementById("maMatrice").innerHTML = maMatrice.MatriceTexte();

	maMatrice.Rotation();
	maMatrice.Rotation();

	var retour = maMatrice.Mouvement();

	maMatrice.Rotation();
	maMatrice.Rotation();

	maMatrice.Affichage();

	affichageText(retour);

}

function MouvementGauche() {
	// document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	maMatrice.Rotation();

	var retour = maMatrice.Mouvement();

	maMatrice.Rotation();
	maMatrice.Rotation();
	maMatrice.Rotation();

	maMatrice.Affichage();

	affichageText(retour);
}

function MouvementDroite() {
	// document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	maMatrice.Rotation();
	maMatrice.Rotation();
	maMatrice.Rotation();

	var retour = maMatrice.Mouvement();

	maMatrice.Rotation();
	matriceVide.Affichage();
	maMatrice.Affichage();

	affichageText(retour);
}

function affichageText(action) {

	document.getElementById("resultat").innerHTML = maMatrice.Score();
	
	document.getElementById("MeilleurScore").innerHTML = maMatrice.Score();

	if (action == "PERDU") {
		document.getElementById("Continue").className = "Cache";
		document.getElementById("Message").innerHTML = "Vous avez perdu... <br>Vortre score est de " + maMatrice.Score();

	}
	if (action == "GAGNE") {
		document.getElementById("Continue").className = "Affiche";
		document.getElementById("Message").innerHTML = "Vous avez gagné!! ";
	}
	if (action == "GAGNE" || action == "PERDU") {

		document.getElementById("Message").className = "Affiche";
		document.getElementById("fg").className = "Cache";
		document.getElementById("hb").className = "Cache";
		document.getElementById("fd").className = "Cache";

	}

}

function Continue() {

	document.getElementById("Message").className = "Cache";
	document.getElementById("Continue").className = "Cache";
	document.getElementById("fg").className = "Affiche";
	document.getElementById("hb").className = "Affiche";
	document.getElementById("fd").className = "Affiche";

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

function GrilleDebug() {

	maMatrice = new Matrix();

	maMatrice.AffecterValeur(0, 0, 2);
	maMatrice.AffecterValeur(0, 1, 4);
	maMatrice.AffecterValeur(0, 2, 2);
	maMatrice.AffecterValeur(0, 3, 4);

	maMatrice.AffecterValeur(1, 0, 32);
	maMatrice.AffecterValeur(1, 1, 64);
	maMatrice.AffecterValeur(1, 2, 32);
	maMatrice.AffecterValeur(1, 3, 64);

	maMatrice.AffecterValeur(2, 0, 1024);
	maMatrice.AffecterValeur(2, 1, 0);
	maMatrice.AffecterValeur(2, 2, 1024);
	maMatrice.AffecterValeur(2, 3, 16);

	maMatrice.AffecterValeur(3, 0, 64);
	maMatrice.AffecterValeur(3, 1, 32);
	maMatrice.AffecterValeur(3, 2, 64);
	maMatrice.AffecterValeur(3, 3, 32);

	maMatrice.Affichage();

}

