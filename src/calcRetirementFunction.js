function calc(Page,
  PtotalFundNestEgg,
  Psalary,
  PsalaryNestEggInterest,
  PsalaryIncrementPercentage,
  PretirementAge,
  PretirementAgeSsn) {
  try {
    let age = Page;
    let totalFundNestEgg = PtotalFundNestEgg;
    let salary = Psalary;
    const salaryNestEggInterest = PsalaryNestEggInterest;
    const salaryIncrementPercentage = PsalaryIncrementPercentage;
    const d = new Date();
    let year = d.getFullYear();
    const retirementAge = PretirementAge;
    const retirementAgeSsn = PretirementAgeSsn;
    const retirementYears = 100 - retirementAge;
    const data = [];
    // const fixedRetirementSalary = 0;
    // const fixedSsnIncome = 0;

    let totalSsnFund = 0;

    // let numberOfYears = (retirementYears + 1);

    for (let index = age; index <= 100; index += 1) {
      let salaryPortion = 0;
      let salarySsnPortion = 0;
      let ssnIncome = 0;

      if (age <= retirementAge) {
        // IF USER IS NOT RETIRED

        // NEST EGG FUND TOTAL = CURRENT NEST EGG FUND + SALARY PORTION
        salaryPortion = salary * (salaryNestEggInterest / 100);
        totalFundNestEgg += salaryPortion;

        // SALARY ALSO INCREASE
        // SALARY = SALARY + SALARY INCREMENT
        salary += (salary * (salaryIncrementPercentage / 100));
      } else {
        // IF USER IS RETIRED
        const thisMonthSalary = (Number(totalFundNestEgg) / Number(retirementYears));
        salary = Number(thisMonthSalary);
        // console.log('TOTAL FUND NEST EGG', totalFundNestEgg);


        totalFundNestEgg -= salary;
        // numberOfYears -= 1;
        // console.log('this month sal', thisMonthSalary);
      }

      if (age <= retirementAgeSsn) {
        // IF USER IS NOT GETTING SSN

        // SSN FUND  = SSN FUND + SALARY'S SSN PORTION
        salarySsnPortion = salary * ((6.2) / 100);
        totalSsnFund += salarySsnPortion;
        if (age > 62) {
          totalSsnFund += (totalSsnFund * (8 / 100));
        }
      } else {
        const thisYearSsnIncome = totalSsnFund / (100 - retirementAgeSsn);
        totalSsnFund -= thisYearSsnIncome;
        ssnIncome = thisYearSsnIncome;
      }

      const totalSalary = salary + ssnIncome;

      data.push({
        age,
        year,
        totalFundNestEgg: (totalFundNestEgg).toFixed(2),
        salaryPortion: (salaryPortion).toFixed(2),
        salary: (salary).toFixed(2),
        totalSsnFund: (totalSsnFund).toFixed(2),
        salarySsnPortion: (salaryPortion).toFixed(2),
        ssnIncome: (ssnIncome).toFixed(2),
        totalSalary: (totalSalary).toFixed(2),
        total: (totalFundNestEgg + totalSsnFund).toFixed(2),
      });

      age += 1;
      year += 1;

      // if (age === retirementAge) {
      //   fixedRetirementSalary = totalFundNestEgg / retirementYears;
      // }
      // if (age === retirementAgeSsn) {
      //   fixedSsnIncome = totalSsnFund / (100 - retirementAgeSsn);
      // }
    }
    return data;
  } catch (error) {
    return error;
  }
}

module.exports = { calc };
