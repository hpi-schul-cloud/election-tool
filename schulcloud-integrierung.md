# Integrierung vom Schul-Cloud Wahl Tool in die Schul-Cloud

## Entry Point
Der geplante Punkt zum Übersprung zwischen Schul-Cloud (SC) und Wahl Tool (WT) ist aktuell der Tools Tab in einem Team oder einer Team-artigen Instanz. Dabei geht es darum, dass ein Schüler aus der SC genau dann zum WT abspringen kann, wenn er sich in einem Kontext befindet in dem eine Wahl entstehen könnte (Beispiel: Team *Klasse* für die Klassensprecherwahl, Team *Schule* für die Schülersprecherwahl).

Beim Wechsel von SC zu WT gelangt der Schüler dann auf seine Startseite im WT auf der **all seine Wahlen** also nicht nur diejenigen, die zu dem Team aus dem er gekommen ist gehören.

## Erforderliche Informationen
Zunächst benötigt das WT eine MongoDB Anbindung, da die Tabellen Election, Candidate und Vote angelegt werden. Aktuell läuft diese DB lokal auf dem Hostenden Rechner auf Port 3100. Für die aktuelle Funktionsfähigkeit existiert außerdem noch eine Students Tabelle, die 40 Beispiel-Schüler mit zufälligen IDs und Namen speichert. Anstelle dieser sollte dann die SC eigene Schüler Tabelle genutzt werden.

Informationen die die Schnittstelle zwischen SC und WT bereitstellen muss sind die folgenden:
* ID des Schülers (Vorausgesetzt das WT kann aus dieser ID dann auch den Namen des Schülers aus der DB auslesen, ansonsten auch den Namen)
* IDs aller Teilnehmer im Kontext aus dem das WT aufgerufen wurde oder eine Möglichkeit diese abzufragen (Nötig damit bei der Wahlerstellung per Default alle angewählt sein können um Aufwand zu minimieren)

