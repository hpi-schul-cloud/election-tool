<template>
  <div>
    <multiselect v-model="selectedStudents"
                 :options="students"
                 :multiple="true"
                 :close-on-select="false"
                 :clear-on-select="false"
                 :preserve-search="true"
                 :selectedLabel="String.fromCharCode(10003)"
                 deselectLabel="Drücke Enter zum Entfernen"
                 deselectGroupLabel="Drücke Enter zum Entfernen der Gruppe"
                 selectLabel="Drücke Enter zum Hinzufügen"
                 selectGroupLabel="Drücke Enter zum Hinzufügen der Gruppe"
                 placeholder="Gib hier den Namen ein"
                 label="name"
                 track-by="_id" :preselect-first="true"
                 openDirection="below"
                 v-on:input="emitInput()">
      <template slot="selection" slot-scope="{ values, search, isOpen }">
          <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">
            Du hast {{ values.length }} Wahlberechtigte ausgewählt
          </span>
      </template>
    </multiselect>
  </div>
</template>

<script>

import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  name: 'Dropdown',
  components: {
    Multiselect
  },
  data: () => {
    return {
      students: [],
      selectedStudents: []
    }
  },
  methods: {
    emitInput () {
      this.$emit('input', this.selectedStudents)
    },
    fetchStudents () {
      let url = '/api/getStudents'
      fetch(url)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.students = result.data
            this.selectedStudents = result.data
            this.emitInput()
          } else {
            this.$alertFailure(this, result.error, true)
          }
        })
    }
  },
  created () {
    this.fetchStudents()
  }
}

</script>

<style scoped>

  >>> .multiselect__content-wrapper {
    max-height: 300px !important;
    min-height: 100px;
  }

  >>> .multiselect__single, >>> .multiselect__input::placeholder {
    color: #bbb;
  }

</style>
