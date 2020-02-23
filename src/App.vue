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
          <v-text-field label="Config name" filled
           v-model="configName"
            counter="15"
           ></v-text-field>
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
          <p style="color:red;">*Filling all the above filleds before calculate is required.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="success"
           @click="handleRetirementTbl(configName)"
            :disabled="$v.$invalid" block>
            calculate

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
      <apexchart width="100%" type="line"
       :options="chartOptions"
        :series="series"
         v-if="showChart"></apexchart>
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
        categories: [],
      },
    },
    series: [],
    ages: [],
    yearToWork: [],
    showChart: false,
    savedConfigs: [],
    configName: '',
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
    async handleRetirementTbl(configName) {
      let year = 2020;
      let { age } = this;
      let totalNestEgg = this.curNestEgg;
      let salary = Number(this.curSalary);
      const data = [];


      for (let index = 1; index <= this.retirementYears; index += 1) {
        totalNestEgg += (salary * (this.salContribution / 100));
        totalNestEgg += (totalNestEgg * (this.nestEggMultipler / 100));
        const contributionFromSalary = (salary * (Number(this.salContribution) / 100)).toFixed(2);
        data.push({
          year, age, totalNestEgg, contributionFromSalary, salary,
        });

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

      this.savedConfigs.push({
        name: configName,
        data,
      });

      // const categories = data.map((e) => e.age);

      // const dataSeries = data.map((e) => Number(e.salary).toFixed(2));
      await this.renderchart();


      this.showTbl = true;
      this.showChart = true;
    },

    renderchart() {
      return new Promise((resolve, reject) => {
        try {
          // Get the ages range first
          const agesArr = [];
          this.savedConfigs.forEach((e) => {
            const ages = e.data.map((el) => el.age);
            const min = Math.min(...ages);
            agesArr.push(min);
          });

          const minAge = Math.min(...agesArr);
          const categories = [];
          for (let index = minAge; index <= 100; index += 1) {
            categories.push(index);
          }

          // Getting ages range finished. ***

          const newSavedConfigs = [];

          this.savedConfigs.forEach((e) => {
            // new config object


            const ages = e.data.map((el) => el.age);
            const min = Math.min(...ages);

            // Find where minimal value's index is
            // const minValIdx = categories.findIndex((e) => Number(e) === Number(min));

            // Map salaries
            const salaries = e.data.map((el) => Math.trunc(el.salary));

            if (min === minAge) {
              newSavedConfigs.push({
                name: e.name,
                data: salaries,
              });
            }
            if (minAge < min) {
              const agesDiff = min - minAge;
              for (let index = 1; index <= agesDiff; index += 1) {
                salaries.unshift(null);
              }
              newSavedConfigs.push({
                name: e.name,
                data: salaries,
              });
            }
          });


          this.chartOptions = {
            chart: {
              id: 'vuechart-example',
            },
            xaxis: {
              categories,
            },
          };
          // this.savedConfigs = newSavedConfigs;
          this.series = newSavedConfigs;


          resolve();
        } catch (error) {
          reject();
        }
      });
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
