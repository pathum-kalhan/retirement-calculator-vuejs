<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>
      Retirement Calculator

      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-card>
        <v-card-text>
          <v-row dense>
            <v-col md="3" cols="12">
          <v-text-field label="Client name" filled
           v-model="client"
            counter="15"
            :error-messages="clientErrors"
                @input="$v.client.$touch()"></v-text-field>
            </v-col>
            <v-col md="3" cols="12">
          <v-text-field label="Current nest egg"
           filled
           v-model.number="curNestEgg"
           :error-messages="nestEggErrors"
           @input="$v.curNestEgg.$touch()"
           type="number">
           </v-text-field>

            </v-col>
            <v-col md="3" cols="12">
          <v-text-field label="Average annual rate of return percentage"
           filled
           v-model.number="nestEggMultipler"
           :error-messages="nestEggMultiplerErrors"
           @input="$v.nestEggMultipler.$touch()"
           type="number">
           </v-text-field>
            </v-col>
            <v-col md="3" cols="12">
          <v-text-field label="Current salary"
          :error-messages="curSalaryErrors"
          @input="$v.curSalary.$touch()"
           filled
           v-model="curSalary"
           type="number">
           </v-text-field>
            </v-col>
            <v-col md="3" cols="12">
          <v-text-field label="Salary contribution percentage"
           filled
           v-model.number="salContribution"
            :error-messages="salaryPercentageErrors"
            @input="$v.salContribution.$touch()"
           type="number">
           </v-text-field>
            </v-col>
            <v-col md="3" cols="12">
          <v-text-field label="Estimated salary increment percentage"

           filled
           v-model="salaryMultipler"
           :error-messages="salaryMultiplerErrors"
           @input="$v.salaryMultipler.$touch()"
           type="number">
           </v-text-field>
            </v-col>
            <v-col md="3" cols="12">
          <v-autocomplete label="Current age"
           filled
           v-model.number="age"
            :items="ages"
           type="number">
          </v-autocomplete>
            </v-col>
            <v-col md="3" cols="12">
          <v-autocomplete label="Number of years to retire"
           filled
           v-model="retirementYears"
           :items="yearToWork"

           type="number">
          </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="success" @click="handleRetirementTbl" :disabled="$v.$invalid">
            retirement nest egg table
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-if="showTbl">
        <v-card-title>
          Retirement nest egg table
        </v-card-title>
        <v-card-text>

          <table border="1">
            <tr>
              <th>Year</th>
              <th>Age</th>
              <th>Total nest egg</th>
              <th>Added from year</th>
              <th>Salary</th>
            </tr>
            <tr v-for="(item,i) in data" :key="i">
              <td>{{item.year}}</td>
              <td>{{item.age}}</td>
              <td>{{Number(item.totalNestEgg).toFixed(2)}}</td>
              <td>{{Number(item.contributionFromSalary).toFixed(2)}}</td>
             <td>{{Number(item.salary).toFixed(2)}}</td>
            </tr>
          </table>
        </v-card-text>
      </v-card>
      <apexchart width="1300" type="line"
       :options="chartOptions"
        :series="series"
         v-if="showTable"></apexchart>
    </v-content>
  </v-app>
</template>

<script>

import { required, maxLength, decimal } from 'vuelidate/lib/validators';

const percentage = (value) => value > 0 && value <= 100;
export default {
  name: 'App',
  mounted() {
    for (let index = 18; index <= 65; index += 1) {
      this.ages.push(index);
    }
    for (let index = 1; index <= 47; index += 1) {
      this.yearToWork.push(index);
    }
  },

  validations() {
    return {
      client: { required, maxLength: maxLength(15) },
      curNestEgg: { required, decimal },
      nestEggMultipler: { required, percentage },
      curSalary: { required, decimal },
      salContribution: { required, percentage },
      salaryMultipler: { required, percentage },
      age: { required },
      retirementYears: { required },
    };
  },
  data: () => ({
    client: '',
    curNestEgg: 50000,
    nestEggMultipler: 3,
    curSalary: 70000,
    salContribution: 4,
    salaryMultipler: 10,
    age: 23,
    retirementYears: 10,
    data: [],
    showTbl: false,
    chartOptions: {
      chart: {
        id: 'vuechart-example',
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [{
      name: 'series-1',
      data: [30, 40, 35, 50, 49, 60, 70, 91],
    }],
    ages: [],
    yearToWork: [],
    showTable: false,
  }),
  computed: {
    clientErrors() {
      const errors = [];
      if (!this.$v.client.$dirty) return errors;
      if (
        !this.$v.client.required
        && errors.push('Client name is required.')
      ) {
        return errors;
      }
      if (
        !this.$v.client.maxLength
        && errors.push('Maximum length for the client name is 15.')
      ) {
        return errors;
      }
      return errors;
    },
    nestEggErrors() {
      const errors = [];
      if (!this.$v.curNestEgg.$dirty) return errors;
      if (
        !this.$v.curNestEgg.required
        && errors.push('Current nest egg is required.')
      ) {
        return errors;
      }
      if (
        !this.$v.curNestEgg.decimal
        && errors.push('Current nest egg should be a number.')
      ) {
        return errors;
      }
      return errors;
    },
    nestEggMultiplerErrors() {
      const errors = [];
      if (!this.$v.nestEggMultipler.$dirty) return errors;
      if (
        !this.$v.nestEggMultipler.required
        && errors.push('Average rate of return percentage is required.')
      ) {
        return errors;
      }
      if (
        !this.$v.nestEggMultipler.percentage
        && errors.push('Average rate of return percentage is invalid.')
      ) {
        return errors;
      }
      return errors;
    },
    curSalaryErrors() {
      const errors = [];
      if (!this.$v.curSalary.$dirty) return errors;
      if (
        !this.$v.curSalary.required
        && errors.push('Current salary is required.')
      ) {
        return errors;
      }
      if (
        !this.$v.curSalary.decimal
        && errors.push('Current salary should be a number.')
      ) {
        return errors;
      }
      return errors;
    },
    salaryPercentageErrors() {
      const errors = [];
      if (!this.$v.salContribution.$dirty) return errors;
      if (
        !this.$v.salContribution.required
        && errors.push('Salary contribution percentage is required.')
      ) {
        return errors;
      }
      if (
        !this.$v.salContribution.percentage
        && errors.push('Salary contribution percentage is invalid.')
      ) {
        return errors;
      }
      return errors;
    },
    salaryMultiplerErrors() {
      const errors = [];
      if (!this.$v.salaryMultipler.$dirty) return errors;
      if (
        !this.$v.salaryMultipler.required
        && errors.push('Percentage is required.')
      ) {
        return errors;
      }
      if (
        !this.$v.salaryMultipler.percentage
        && errors.push('Percentage is invalid.')
      ) {
        return errors;
      }
      return errors;
    },
  },
  methods: {
    handleRetirementTbl() {
      let year = 2020;
      let { age } = this;
      let totalNestEgg = this.curNestEgg;
      let salary = Number(this.curSalary);
      const data = [];


      for (let index = 1; index <= this.retirementYears; index += 1) {
        totalNestEgg += (salary * (this.salContribution / 100));
        const contributionFromSalary = (salary * (Number(this.salContribution) / 100)).toFixed(2);
        data.push({
          year, age, totalNestEgg, contributionFromSalary, salary,
        });

        totalNestEgg += (totalNestEgg * (this.nestEggMultipler / 100));
        year += 1;
        age += 1;
        salary += (salary * (this.salaryMultipler / 100));
      }
      const yearsCount = 100 - (age - 1);


      salary = totalNestEgg / yearsCount;
      for (let index = 1; index <= yearsCount; index += 1) {
        totalNestEgg -= salary;
        data.push({
          year, age, contributionFromSalary: 0, salary, totalNestEgg,
        });
        year += 1;
        age += 1;
      }
      this.data = data;

      const categories = data.map((e) => e.age);
      this.chartOptions = {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories,
        },
      };

      const dataSeries = data.map((e) => Number(e.salary).toFixed(2));
      this.series = [{
        name: 'Run 1',
        data: dataSeries,
      }];

      this.showTbl = true;
      this.showTable = true;
    },
  },
};
</script>
<style  scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 2px;
  text-align: right;
}
</style>
