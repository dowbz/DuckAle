/**
 * @author Manu
 */

var TAILLE_MATRICE = 4;
var entier = ( typeof Int32Array != 'undefined');



function Matrix() {
	// on cree un vecteur avec toutes les valeurs Ã  0
	var m = Array.prototype.concat.apply([], arguments);
	var score = Array.prototype.concat.apply([], arguments);

	if (!m.length) {

		for (var i = 0; i < TAILLE_MATRICE * TAILLE_MATRICE; i++)
			m.push(0);

	}

	if (!score.length) {
		score.push(0);
	}
	//alert(typeof m);

	this.m = entier ? new Int32Array(m) : m;
	this.score = entier ? new Int32Array(score) : score;
}

Matrix.prototype = {

	// fait faire a la matrice 1/4 de tour dans le sens anti-horaire
	Rotation : function() {
		result = new Matrix();
		var v = this.m;
		var m = result.m;

		for (var lig = 0; lig < TAILLE_MATRICE; ++lig) {
			for (var col = 0; col < TAILLE_MATRICE; ++col) {
				m[lig + col * TAILLE_MATRICE] = v[(TAILLE_MATRICE - col - 1) + lig * TAILLE_MATRICE];
			}
		}

		// on applique la matrice
		this.m = result.m;
	},

	// permet de recupÃ©rer la valeur correspondant Ã  la cellule
	Valeur : function(ligne, colonne) {
		return this.m[ligne * TAILLE_MATRICE + colonne];
	},

	// permet d'affecter une valeur dans la cellule voulue
	AffecterValeur : function(ligne, colonne, valeur) {
		this.m[ligne * TAILLE_MATRICE + colonne] = valeur;
	},

	// ajoute une nouvelle valeur 2 ou 4 dans une cellule vide
	// return vrai si OK, faux si il n'y a pas de cellule vide poru ajouter une valeur.
	// test fin de partie
	PopCase : function() {

		var celluleVide = [];
		var m = this.m;

		// determination de la cellule Ã  remplir
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 0)
				celluleVide.push(i);
		}

		if (celluleVide.length == 0)
			return false;

		var indiceCelluleVide = Math.floor(Math.random() * celluleVide.length);

		// determination de la valeur Ã  ajouter 2 ou 4

		var valeurAjoute = Math.pow(2, Math.floor(Math.random() * 2) + 1);
		//alert( Math.floor(Math.random() *2));

		m[celluleVide[indiceCelluleVide]] = valeurAjoute;

		// on test pour voir si il y a un mouvement possible

		var retour = false;
		celluleVide = [];

		// avant le test de mouvement possible il faut s'assurer que le tableau soit plein....
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 0)
				celluleVide.push(i);
		}

		if (celluleVide.length == 0) {
			// on recherche deux valeurs cote à cote dans les lignes
			for (var lig = 0; lig < TAILLE_MATRICE - 1; lig++)
				for (var col = 0; col < TAILLE_MATRICE; col++)
					if (m[lig + col * TAILLE_MATRICE] == m[lig + 1 + col * TAILLE_MATRICE])
						retour = true;

			// on rrecommance pour les colonnes
			for (var col = 0; col < TAILLE_MATRICE - 1; col++)
				for (var lig = 0; lig < TAILLE_MATRICE; lig++)
					if (m[lig + col * TAILLE_MATRICE] == m[lig + 1 + col * TAILLE_MATRICE])
						retour = true;

		} else // si il y a des cellule vide on ne fini pas la partie....
			retour = true;

		return retour;

	},

	MergeGravite : function() {

		for (var col = 0; col < TAILLE_MATRICE; col++) {
			var ValeurNonVideColonne = new Array();

			// on recupere les cellules non vide par colonne
			for (var lig = TAILLE_MATRICE - 1; lig >= 0; lig--)
				if (this.m[lig * TAILLE_MATRICE + col] != 0)
					ValeurNonVideColonne.push(this.m[lig * TAILLE_MATRICE + col]);

			//alert("Nombre de valeur non vide de la colonne " + col + " : " +ValeurNonVideColonne.length );

			// on vide toutes les cellules de la colonne
			for (var lig = TAILLE_MATRICE - 1; lig >= 0; lig--)
				this.m[lig * TAILLE_MATRICE + col] = 0;

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

				//alert("Valeur " + valeurInserer + " inserer dans la colonne " + col + " a la ligne : " +ligneValeurInser);

				if (valeurInserer == 2048) {
					alert("FÃ©licitations, vous avez gagnÃ©!! \nVotre score est de : " + matrice.Score());
					NouvelleGrille();

				}

				// on insere la valeur en partant du bas de la matrice
				this.m[(ligneValeurInser) * TAILLE_MATRICE + col] = valeurInserer;
				ligneValeurInser--;
			}

		}
	},

	// renvoie la matrice sous forme de texte
	MatriceTexte : function() {
		var valeurCellule;
		var nom;
		var baliseP;
		var baliseTd;

		for (var cellule = 0; cellule < TAILLE_MATRICE * TAILLE_MATRICE; cellule++) {
			nom = "case" + cellule;
			baliseP = document.getElementById(nom);
			baliseTd = baliseP.parentNode;
			valeurCellule = this.m[cellule];
			baliseP.innerHTML = valeurCellule > 0 ? this.m[cellule] : " ";

			switch(valeurCellule) {
			case 0:
				{
					baliseTd.className = "grisflat";
					baliseP.className = "size01";
				}
				break;

			case 2:
			case 4:
			case 8:
				{
					baliseTd.className = "vert";
					baliseP.className = "size01";
				}
				break;
			case 16:
			case 32:
			case 64:
			case 128:
				{
					baliseTd.className = "bleu";
					baliseP.className = "size01";
				}
				break;
			case 256:
			case 512:
				{
					baliseTd.className = "orange";
					baliseP.className = "size01";
				}
				break;
			case 1024:
			case 2048:
				{
					baliseTd.className = "violet";
					baliseP.className = "size02";
				}
				break;
			case 4096:
			case 5192:
				{
					baliseTd.className = "rouge";
					baliseP.className = "size02";
				}
				break;
			case 16384:
				{
					baliseTd.className = "gris-bleu";
					baliseP.className = "size03";
				}
				break;
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

	matrice.MatriceTexte();
	document.getElementById("resultat").innerHTML = matrice.Score();
}

function Pop() {

	if (matrice.PopCase() == false)
		alert("Matrice pleine");
	else
		document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

}

function Merge() {

	matrice.MergeGravite();
	document.getElementById("matriceMerger").innerHTML = matrice.MatriceTexte();
}

function Tour() {

	matrice.Rotation();
	document.getElementById("matrice").innerHTML = matrice.MatriceTexte();
}

function MouvementBas() {
	//document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	matrice.MergeGravite();

	PopEtAffichage();
}

function MouvementHaut() {
	//document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	matrice.Rotation();
	matrice.Rotation();

	matrice.MergeGravite();

	matrice.Rotation();
	matrice.Rotation();

	PopEtAffichage();
}

function MouvementGauche() {
	// document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	matrice.Rotation();

	matrice.MergeGravite();

	matrice.Rotation();
	matrice.Rotation();
	matrice.Rotation();

	PopEtAffichage();
}

function MouvementDroite() {
	// document.getElementById("matrice").innerHTML = matrice.MatriceTexte();

	matrice.Rotation();
	matrice.Rotation();
	matrice.Rotation();

	matrice.MergeGravite();

	matrice.Rotation();

	PopEtAffichage();
}

function PopEtAffichage() {

	if (matrice.PopCase() == false) {
		alert("Matrice pleine. Vous avez perdu :( ... \nVotre score est de : " + matrice.Score());
		NouvelleGrille();
	} else {
		matrice.MatriceTexte();
		document.getElementById("resultat").innerHTML = matrice.Score();
	}
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
