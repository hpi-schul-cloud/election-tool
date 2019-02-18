<template>
    <div class="contentWrapper">
      <div class="card introduction">
        <h2 class="title"> ✨ Willkommen beim Schul-Cloud Wahl-Tool! ✨</h2>
        <p>Im Folgenden erklären wir dir, wie du dich auf unserem Tool zurechtfindest. Jede Wahl besteht aus genau drei Phasen: </p>
        <ol>
          <li>die <b>Bewerbungsphase</b>, in der jeder wahlberechtigte Schüler die Möglichkeit hat sich als Kandidat für die Wahl aufzustellen</li>
          <li>die <b>Wahlphase</b>, in der jeder wahlberechtigte Schüler die Möglichkeit hat seine Stimme für den Kandidaten seiner Wahl abzugeben</li>
          <li>die <b>Ergebnisphase</b>, in der die Wahl beendet und das Ergebnis für alle Wahlberechtigten sichtbar ist</li>
        </ol>
        <p>Dein Wahlleiter kann die Wahl starten und anschließend die Phasen manuell oder automatisch durch Festlegen von Fristen weiterschalten. Im Fall des automatischen Phasenwechsels kannst du dir durch einen Klick auf die Fortschrittsanzeige (oben) die verbleibende Zeit in der aktuellen Phase anzeigen lassen.</p>
        <p>Solltest du im Laufe der Wahl noch Fragen haben, kannst du jederzeit auf das kleine Hilfe-Symbol oben rechts neben deinem Namen klicken um eine kurze Einweisung zu erhalten.</p>
      </div>
    </div>
</template>

<script>
export default {
  name: 'InfoPage',
  beforeMount () {
    this.$emit('check-route')
    this.$emit('check-user')
  }
}
</script>

<style scoped>
  .introduction {
    text-align: left;
  }

  .introduction li {
    margin: .5em 0;
  }

  .title {
    margin: 1.2em 0;
  }
</style>
