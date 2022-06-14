import { useCallback } from "react";

import "survey-core/defaultV2.min.css";
// import 'survey-core/survey.min.css';
import { StylesManager, Model } from "survey-core";
import { Survey } from "survey-react-ui";

StylesManager.applyTheme("defaultV2");

const surveyJson = {
  version: 1,
  logoPosition: "right",
  focusOnFirstError: false,
  progressBarType: "buttons",
  showProgressBar: "top",
  pages: [
    {
      name: "Start page",
      navigationTitle: "Start page",
      navigationDescription: "Producer Profile",
      elements: [
        {
          type: "panel",
          name: "panel1",
          elements: [
            {
              type: "text",
              name: "org_name",
              title: "Name of the organization:"
            },
            {
              type: "radiogroup",
              name: "producer_setup",
              title: "Choose your producer setup:",
              isRequired: true,
              choices: [
                {
                  value: "spo",
                  text:
                    "Small-scale producer organization or Contract production"
                },
                {
                  value: "hlo",
                  text: "Hired labor plantation"
                }
              ]
            },
            {
              type: "radiogroup",
              name: "organic_logic",
              title:
                "Were some or all of your products under Fairtrade certification also produced under an organic certification in the last calendar/ production year?",
              isRequired: true,
              choices: [
                {
                  value: "mixed",
                  text:
                    "Some products (both organic and conventional production)"
                },
                {
                  value: "conventional_only",
                  text: "None of the products (only conventional production)"
                },
                {
                  value: "organic_only",
                  text: "All products (only organic production)"
                }
              ]
            }
          ]
        }
      ],
      description: "Start Page: Producer Profile"
    },

    {
      name: "SPO Members",
      navigationTitle: "SPO Members",
      navigationDescription: "in your organization",
      elements: [
        {
          type: "panel",
          name: "Number of farmers",
          elements: [
            {
              type: "expression",
              name: "q4_textt",
              title:
                "Record the number of farmers that are members of your SPO. Count each member only once. Consider members in transition, or members that produce both conventional and organic, as organic."
            },
            {
              type: "expression",
              name: "coventional_text",
              visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
              title: "Conventional",
              hideNumber: true,
              validators: [
                {
                  type: "expression"
                }
              ]
            },
            {
              type: "expression",
              name: "organic_text",
              visibleIf: "{organic_logic} anyof ['organic_only', 'mixed']",
              startWithNewLine: false,
              title: "Organic",
              hideNumber: true
            },
            {
              type: "expression",
              name: "total_text_q4",
              startWithNewLine: false,
              title: "Total",
              hideNumber: true
            },
            {
              type: "text",
              name: "farmers_conventional_total",
              visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
              titleLocation: "hidden",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number."
                }
              ]
            },
            {
              type: "text",
              name: "farmers_organic_total",
              visibleIf: "{organic_logic} anyof ['organic_only', 'mixed']",
              startWithNewLine: false,
              titleLocation: "hidden",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number."
                }
              ]
            },
            {
              type: "expression",
              name: "farmers_total",
              startWithNewLine: false,
              titleLocation: "hidden",
              validators: [
                {
                  type: "expression"
                }
              ],
              expression: "{farmers_conventional_total}+{farmers_organic_total}"
            }
          ],
          visibleIf: "{producer_setup} = 'spo'",
          isRequired: true
        }
      ],
      description: "SPO Members: in your organization"
    },
    {
      name: "SPO Members",
      navigationTitle: "SPO Members",
      navigationDescription: "Gender & Youth",
      elements: [
        {
          type: "expression",
          name: "q4_text",
          visibleIf: "{producer_setup} = 'spo'",
          title:
            "Record the number of farmers that are members of your SPO, by gender if known. Count each member only once. Consider members in transition, or members that produce both conventional and organic, as organic. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded here or in the previous questions."
        },
        {
          type: "boolean",
          name: "farmers_gender_known",
          visibleIf: "{producer_setup} = 'spo'",
          title:
            "Do you know the number of your organization's members by gender?",
          hideNumber: true,
          defaultValue: "false",
          /*isRequired: true,*/
          labelTrue: "No",
          labelFalse: "Yes"
        },
        {
          type: "panel",
          name: "Number of farmers by gender",
          elements: [
            {
              type: "expression",
              name: "gender_text_q5",
              title: "Gender",
              titleLocation: "left",
              hideNumber: true
            },
            {
              type: "expression",
              name: "conventional_text_Q5",
              visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
              startWithNewLine: false,
              title: "Conventional",
              titleLocation: "left",
              hideNumber: true
            },
            {
              type: "expression",
              name: "organic_text_q5",
              visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
              startWithNewLine: false,
              title: "Organic",
              titleLocation: "left",
              hideNumber: true
            },
            {
              type: "expression",
              name: "total_text_q5",
              startWithNewLine: false,
              title: "Total",
              titleLocation: "left",
              hideNumber: true
            },
            {
              type: "expression",
              name: "female_text_q5",
              title: "Female",
              titleLocation: "left",
              hideNumber: true
            },
            {
              type: "text",
              name: "farmers_conventional_female",
              visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
              startWithNewLine: false,
              titleLocation: "hidden",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "farmers_organic_female",
              visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
              startWithNewLine: false,
              titleLocation: "hidden",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "expression",
              name: "farmers_female",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression:
                "{farmers_conventional_female}+{farmers_organic_female}"
            },
            {
              type: "expression",
              name: "male_text_q5",
              title: "Male",
              titleLocation: "left",
              hideNumber: true
            },
            {
              type: "text",
              name: "farmers_conventional_male",
              visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
              startWithNewLine: false,
              titleLocation: "hidden",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number",
                  minValue: 0
                }
              ]
            },
            {
              type: "text",
              name: "farmers_organic_male",
              visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
              startWithNewLine: false,
              titleLocation: "hidden",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number",
                  minValue: 0
                }
              ]
            },
            {
              type: "expression",
              name: "farmers_male",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression: "{farmers_conventional_male}+{farmers_organic_male}"
            },
            {
              type: "expression",
              name: "total_text",
              title: "Total",
              hideNumber: true
            },
            {
              type: "expression",
              name: "RO_farmers_conventional_total",
              visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression: "{farmers_conventional_total}"
            },
            {
              type: "expression",
              name: "RO_farmers_organic_total",
              visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression: "{farmers_organic_total}"
            },
            {
              type: "expression",
              name: "RO_farmers_total",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression: "{farmers_total}"
            }
          ],
          visibleIf: "{farmers_gender_known} = false",
          /*isRequired: true,*/
          requiredErrorText: "Please fix errors"
        },
        {
          type: "expression",
          name: "q6_text",
          title:
            "Record the number of farmers that are members of your SPO by age group, and provide gender breakdown, if known:"
        },
        {
          type: "boolean",
          name: "farmers_age_known",
          title:
            "Do you know the number of your organization's members by age groups?",
          hideNumber: true,
          defaultValue: "false",
          /*isRequired: true,*/
          labelTrue: "No",
          labelFalse: "Yes"
        },
        {
          type: "panel",
          name: "Number of farmers by age",
          elements: [
            {
              type: "expression",
              name: "age_text",
              title: "Age group",
              hideNumber: true
            },
            {
              type: "expression",
              name: "totalage_text",
              startWithNewLine: false,
              title: "Total",
              hideNumber: true
            },
            {
              type: "expression",
              name: "gender_known_text",
              startWithNewLine: false,
              title: "Gender breakdown known",
              hideNumber: true
            },
            {
              type: "expression",
              name: "female_age_text",
              startWithNewLine: false,
              title: "Female",
              hideNumber: true
            },
            {
              type: "expression",
              name: "male_age_text",
              startWithNewLine: false,
              title: "Male",
              hideNumber: true
            },
            {
              type: "expression",
              name: "age_16_28_text",
              title: "16-28 years old",
              hideNumber: true
            },
            {
              type: "text",
              name: "farmers_16_28",
              startWithNewLine: false,
              titleLocation: "hidden",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "boolean",
              name: "farmers_gender_known_16_28",
              startWithNewLine: false,
              titleLocation: "hidden",
              hideNumber: true,
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes"
            },
            {
              type: "text",
              name: "farmers_female_16_28",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{farmers_gender_known_16_28} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "farmers_male_16_28",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{farmers_gender_known_16_28} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "expression",
              name: "age_29_35_text",
              title: "29-35 years old",
              hideNumber: true
            },
            {
              type: "text",
              name: "farmers_29_35",
              startWithNewLine: false,
              titleLocation: "hidden",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "boolean",
              name: "farmers_gender_known_29_35",
              startWithNewLine: false,
              titleLocation: "hidden",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes"
            },
            {
              type: "text",
              name: "farmers_female_29_35",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{farmers_gender_known_29_35} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "farmers_male_29_35",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{farmers_gender_known_29_35} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "expression",
              name: "age_36_text",
              title: "36 years or older",
              hideNumber: true
            },
            {
              type: "text",
              name: "farmers_36",
              startWithNewLine: false,
              titleLocation: "hidden",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "boolean",
              name: "farmers_gender_known_36",
              startWithNewLine: false,
              titleLocation: "hidden",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes"
            },
            {
              type: "text",
              name: "farmers_female_36",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{farmers_gender_known_36} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "farmers_male_36",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{farmers_gender_known_36} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "expression",
              name: "total_q6",
              title: "Total",
              hideNumber: true
            },
            {
              type: "expression",
              name: "farmers_total_age",
              startWithNewLine: false,
              titleLocation: "hidden",
              validators: [
                {
                  type: "expression",
                  expression: "{farmers_total_age} <= '{farmers_total}'"
                }
              ],
              expression: "{farmers_16_28}+{farmers_29_35}+{farmers_36}"
            },
            {
              type: "expression",
              name: "na",
              startWithNewLine: false,
              titleLocation: "hidden",
              hideNumber: true
            },
            {
              type: "expression",
              name: "farmers_female_age_total",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression:
                "{farmers_female_16_28}+{farmers_female_29_35}+{farmers_female_36}"
            },
            {
              type: "expression",
              name: "RO_total_male_Q5",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression:
                "{farmers_male_16_28}+{farmers_male_29_35}+{farmers_male_36}"
            }
          ],
          isRequired: true
        }
      ],
      description: "SPO Members: Gender & Youth",
      visibleIf: "{producer_setup} = 'spo'"
    },
    {
      name: "Workers",
      navigationTitle: "Workers",
      navigationDescription: "in your organization",
      elements: [
        {
          type: "expression",
          name: "q7_text",
          title:
            "Record the number of workers employed by your organization in the last calendar year with the following types of employment contracts."
        },
        {
          type: "expression",
          name: "info_box1",
          title:
            "Workers are defined as all waged employees including migrant, temporary, seasonal, sub-contracted and permanent workers. Workers include all hired personnel whether they work in the field, in processing sites, or in administration. The term is restricted to personnel that can be unionised and therefore middle and senior and other professionals are generally not considered workers.",
          hideNumber: true
        },
        {
          type: "expression",
          name: "info_box_spo_only",
          visibleIf: "{producer_setup} = 'spo'",
          title:
            "This applies only to those workers hired by your organization directly. Workers hired by individual SPO members that work on farms should not be counted in this section.",
          hideNumber: true
        },
        {
          type: "expression",
          name: "info_box2",
          title:
            "For all types of workers, employment refers to any activity that one performs to produce goods or provide services for pay or profit.The following definitions of types of workers apply: /nPermanent workers: A permanent worker is a worker that has an employment relationship with the company/organization for an indefinite period of time. /nFixed-term workers: A fixed-term (or temporary) worker is a worker that has an employment relationship with the company/organization that automatically ends or may be extended after a certain duration previously agreed with the employer./n Sub-contracted worker: A sub-contracted worker is a worker employed and paid by a third party, usually a labour broker, to provide labour to a third party in exchange for a fee that is collected by the broker. /nSeasonal worker: A seasonal worker is a worker that provides labour during certain seasons, usually during harvesting. Seasonal workers may be directly employed (usually as a fixed-term worker) or sub-contracted.",
          hideNumber: true
        },
        {
          type: "panel",
          name: "Number of workers",
          elements: [
            {
              type: "text",
              name: "workers_permanent",
              title: "Permanent workers",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_fixed_term",
              title: "Fixed-term workers",
              /*startWithNewLine: false,*/
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_subcontractor",
              title: "Sub-contracted workers",
              /*startWithNewLine: false,*/
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "expression",
              name: "workers_total",
              title: "Total workers",
              /*startWithNewLine: false,*/
              hideNumber: true,
              expression:
                "{workers_permanent}+{workers_fixed_term}+{workers_subcontractor}"
            },
            {
              type: "expression",
              name: "workers_seasonal_max_hidden",
              title: "Max number of seasonal workers",
              /*startWithNewLine: false,*/
              hideNumber: true,
              visible: false,
              expression: "{workers_fixed_term}+{workers_subcontractor}"
            }
          ]
          /*isRequired: true*/
        },
        {
          type: "boolean",
          name: "workers_gender_known",
          title: "Do you know number of workers by gender?",
          defaultValue: "false",
          /*isRequired: true,*/
          labelTrue: "No",
          labelFalse: "Yes"
        },
        {
          type: "panel",
          name: "Number of workers by gender",
          elements: [
            {
              type: "expression",
              name: "q8_text",
              title:
                "Record the number of workers employed by your organization in the last calendar year, by gender, with the following types of employment contracts. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded here or in the previous question."
            },
            {
              type: "text",
              name: "workers_permanent_female",
              title: "Female permanent workers",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_permanent_male",
              title: "Male permanent workers",
              startWithNewLine: false,
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_fixed_term_female",
              title: "Female fixed-term workers",
              /*startWithNewLine: false,*/
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_fixed_term_male",
              title: "Male fixed-term workers",
              startWithNewLine: false,
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_subcontractor_female",
              title: "Female sub-contracted workers",
              /*startWithNewLine: false,*/
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_subcontractor_male",
              title: "Male sub-contracted workers",
              startWithNewLine: false,
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "expression",
              name: "workers_female",
              title: "Total female workers",
              /*startWithNewLine: false,*/
              hideNumber: true,
              expression:
                "{workers_permanent_female}+{workers_fixed_term_female}+{workers_subcontractor_female}"
            },
            {
              type: "expression",
              name: "workers_male",
              title: "Total male workers",
              startWithNewLine: false,
              hideNumber: true,
              expression:
                "{workers_permanent_male}+{workers_fixed_term_male}+{workers_subcontractor_male}"
            }
          ],
          visibleIf: "{workers_gender_known} = false",
          isRequired: true
        }
      ],
      description: "Workers in your organization"
    },
    {
      name: "Workers",
      navigationTitle: "Workers",
      navigationDescription: "Seasonal",
      elements: [
        {
          type: "text",
          name: "workers_seasonal_total",
          title:
            "Of the {workers_seasonal_max_hidden} fixed-term and sub-contracted workers hired by your organization, how many are seasonal workers?",
          validators: [
            {
              type: "numeric",
              text: "Please enter a valid number"
            }
          ]
        },
        {
          type: "boolean",
          name: "workers_seasonal_gender_known",
          title: "Do you know number of seasonal workers by gender?",
          hideNumber: true,
          defaultValue: "false",
          /*isRequired: true,*/
          labelTrue: "No",
          labelFalse: "Yes"
        },
        {
          type: "panel",
          name: "Number of seasonal workers by gender",
          title:
            "Please record the number of female and male seasonal workers hired by your organization",
          elements: [
            {
              type: "text",
              name: "workers_seasonal_female",
              title: "Female seasonal workers",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_seasonal_male",
              title: "Male seasonal workers",
              startWithNewLine: false,
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            }
          ],
          visibleIf: "{workers_seasonal_gender_known} = false"
          /*isRequired: true*/
        }
      ],
      visibleIf: "{producer_setup} = 'hlo'"
    },
    {
      name: "Workers: Youth",
      navigationTitle: "Workers",
      navigationDescription: "Youth",
      elements: [
        {
          type: "expression",
          name: "question54",
          visibleIf: "{producer_setup} = 'hlo'",
          title:
            "Record the number of workers hired by your organization, by age group."
        },
        {
          type: "boolean",
          name: "workers_age_known",
          visibleIf: "{producer_setup} = 'hlo'",
          title: "Do you know the number of your workers by age groups?",
          hideNumber: true,
          defaultValue: "false",
          /*isRequired: true,*/
          labelTrue: "No",
          labelFalse: "Yes"
        },
        {
          type: "panel",
          name: "Number of workers by age",
          elements: [
            {
              type: "panel",
              name: "Number of workers age 16 to 28 years old",
              title: "Number of workers age 16 to 28 years old",
              elements: [
                {
                  type: "text",
                  name: "total_workers_16to28",
                  title: "Total number of workers age 16 to 28",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "boolean",
                  name: "workers_gender_known_16_28",
                  title: "Do you know the number of male and female workers?",
                  startWithNewLine: false,
                  hideNumber: true,
                  defaultValue: "true",
                  labelTrue: "No",
                  labelFalse: "Yes"
                },
                {
                  type: "text",
                  name: "workers_female_16_28",
                  title: "Number of female workers",
                  hideNumber: true,
                  visibleIf: "{workers_gender_known_16_28} = false",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_male_16_28",
                  title: "Number of male workers",
                  startWithNewLine: false,
                  hideNumber: true,
                  visibleIf: "{workers_gender_known_16_28} = false",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "Number of workers age 29 to 35 years old",
              title: "Number of workers age 29 to 35 years old",
              elements: [
                {
                  type: "text",
                  name: "workers_29_35",
                  title: "Total number of workers age 29 to 35",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "boolean",
                  name: "workers_gender_known_29_35",
                  title: "Do you know the number of male and female workers?",
                  startWithNewLine: false,
                  hideNumber: true,
                  defaultValue: "true",
                  labelTrue: "No",
                  labelFalse: "Yes"
                },
                {
                  type: "text",
                  name: "workers_female_29_35",
                  title: "Number of female workers",
                  hideNumber: true,
                  visibleIf: "{workers_gender_known_29_35} = false",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_male_29_35",
                  title: "Number of male workers",
                  startWithNewLine: false,
                  hideNumber: true,
                  visibleIf: "{workers_gender_known_29_35} = false",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                }
              ]
            },
            {
              type: "expression",
              name: "36_years_old_text",
              title: "36 years or older",
              hideNumber: true
            },
            {
              type: "text",
              name: "workers_36",
              title: "Total number of workers 36 years or older",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "boolean",
              name: "workers_gender_known_36",
              startWithNewLine: false,
              titleLocation: "hidden",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes"
            },
            {
              type: "text",
              name: "workers_female_36",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{workers_gender_known_36} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "workers_male_36",
              startWithNewLine: false,
              titleLocation: "hidden",
              enableIf: "{workers_gender_known_36} = false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "expression",
              name: "total_q11",
              title: "Total",
              hideNumber: true
            },
            {
              type: "expression",
              name: "workers_age_total",
              startWithNewLine: false,
              titleLocation: "hidden",
              validators: [
                {
                  type: "expression",
                  expression: "{workers_age_total} <= '{workers_total}'"
                }
              ],
              expression: "{workers_16_28}+{workers_29_35}+{workers_36}"
            },
            {
              type: "expression",
              name: "question78",
              startWithNewLine: false,
              titleLocation: "hidden",
              hideNumber: true
            },
            {
              type: "expression",
              name: "question79",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression:
                "{workers_female_16_28}+{workers_female_29_35}+{workers_female_36}"
            },
            {
              type: "expression",
              name: "RO_male workers",
              startWithNewLine: false,
              titleLocation: "hidden",
              expression:
                "{workers_male_16_28}+{workers_male_29_35}+{workers_male_36}"
            }
          ],
          visibleIf: "{workers_age_known} = false"
          /*isRequired: true*/
        }
      ],
      description: "Workers: Youth"
    },
    {
      name: "Land area",
      navigationTitle: "Land area",
      navigationDescription: "Under cultivation",
      elements: [
        {
          type: "matrixdynamic",
          name: "land_product_tree",
          title:
            "Please indicate the products that your organization produced according to the Fairtrade standards in the last calendar/ production year. Use the left-hand column to filter for the product(s).",
          columns: [
            {
              name: "product_category_major",
              title: "Major product category",
              cellType: "dropdown",
              choices: [
                {
                  value: 1,
                  text: "Coffee"
                },
                {
                  value: 2,
                  text: "Cocoa"
                },
                {
                  value: 3,
                  text: "Bananas"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "product_category_minor",
              title: "Minor product category",
              cellType: "dropdown",
              choices: [
                {
                  value: 1,
                  text: "Coffee arabica"
                },
                {
                  value: 2,
                  text: "Coffee robusta"
                },
                {
                  value: 3,
                  text: "Cocoa"
                },
                {
                  value: 4,
                  text: "Bananas"
                }
              ],
              storeOthersAsComment: true
            }
          ]
        },
        {
          type: "radiogroup",
          name: "land_area_unit",
          title:
            "What is the unit in which you would like to report your land area?",
          /*isRequired: true,*/
          choices: [
            {
              value: "ha",
              text: "hectares"
            },
            {
              value: "acre",
              text: "acres"
            }
          ]
        },
        {
          type: "panel",
          name: "land_area_panel",
          elements: [
            {
              type: "text",
              name: "total_land_managed",
              title:
                "What is the total land area in {land_area_unit} under cultivation by all SPO members (land under cultivation of both Fairtrade and non-Fairtrade certified crops)? ",
              visibleIf: "{producer_setup} = 'spo'",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              type: "text",
              name: "total_area_ft_certification",
              startWithNewLine: false,
              title:
                "What is the total land area in {land_area_unit} under cultivation with Fairtrade crops within your organization?",
              validators: [
                {
                  type: "expression",
                  text:
                    "Fairtrade land area is larger than total land area. Please fix.",
                  expression:
                    "{total_land_managed} >= {total_area_ft_certification}"
                },
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ],
              inputType: "number"
            }
          ]
        },
        {
          type: "matrixdropdown",
          name: "land_area_production_matrix",
          title:
            "Record the land area in {land_area_unit} under cultivation of Fairtrade crops for each Fairtrade-certified product. If the area is not known, indicate so with the checkboxes. Note, if your organization produces honey, please report the number of beehives instead of land area.",
          columns: [
            {
              name: "land_area_known",
              title:
                "Do you know the land area under cultivation of each product?",
              cellType: "boolean",
              minWidth: "180px",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes",
              showTitle: true
            },
            {
              name: "land_total_production",
              title: "Total land area in {land_area_unit} by product",
              cellType: "text",
              minWidth: "150px",
              visibleIf: "{row.land_area_known}=false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "land_area_known_attribute",
              title:
                "Do you know the conventional and/or organic land area under cultivation of each product?",
              cellType: "boolean",
              minWidth: "200px",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes",
              showTitle: true
            },
            {
              name: "land_conventional_production",
              title:
                "Land area in {land_area_unit} under conventional cultivation",
              cellType: "text",
              minWidth: "150px",
              visibleIf:
                "{row.land_area_known_attribute}=false" &&
                "{organic_logic} <> 'organic_only'",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "land_organic_production",
              title: "Land area in {land_area_unit} under organic cultivation",
              cellType: "text",
              minWidth: "150px",
              visibleIf:
                "{row.land_area_known_attribute}=false" &&
                "{organic_logic} <> 'conventional_only'",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            }
          ],
          horizontalScroll: true,
          rows: [
            {
              value: "Row 1",
              text: "[Product 1]"
            },
            {
              value: "Row 2",
              text: "[Product 2]"
            }
          ],
          rowTitleWidth: "150px"
        }
      ],
      description: "Land Area Under Cultivation"
    },
    {
      name: "Production",
      navigationTitle: "Production",
      navigationDescription: "Volumes produced & forecasts",
      elements: [
        {
          type: "panel",
          name: "unit_descriptions_panel",
          elements: [
            {
              type: "expression",
              name: "unit_descriptions",
              title:
                "A note on units: please make sure the unit you select is correct and applicable to the product you are reporting on. Please see here a description of uses for each unit:",
              hideNumber: true
            },
            {
              type: "panel",
              name: "panel4",
              elements: [
                {
                  type: "expression",
                  name: "kg_description",
                  title: "Kilograms (kg)",
                  description:
                    "Use kg when you know the volume of your product in kilograms",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "mt_description",
                  startWithNewLine: false,
                  title: "Metric tons (MT)",
                  description:
                    "Use MT when you know the volume of your product in metric tons",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "boxes_large_description",
                  title: "18.14 kg Boxes",
                  description:
                    "For bananas only: use 18.14 kg Boxes when you know the number of boxes of bananas",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "boxes_small_description",
                  startWithNewLine: false,
                  title: "13.5 kg Boxes",
                  description:
                    "For bananas only: use 13.5 kg Boxes when you know the number of boxes of bananas",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "pounds_description",
                  title: "Pound",
                  description:
                    "Use pound when you know the volume of your product in pounds",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "question6",
                  startWithNewLine: false,
                  title: "Quintales (46 kg)",
                  description:
                    "Use quintales when you know the volume of your product in quintales (1 quintale = 46 kg)",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "flowers_description",
                  title: "Stems of flowers",
                  description:
                    "For flowers and plants only: use when you know the number of flowers or plants",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "1000stems_description",
                  startWithNewLine: false,
                  title: "1000 stems of flowers",
                  description:
                    "For flowers and plants only: use when you know the number of 1,000 flower or plant bunches",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "litres_description",
                  title: "Litres",
                  description:
                    "For argan oil and wine bottles only: use litres when you know the volume of your oil or wine in litres",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "items_description",
                  startWithNewLine: false,
                  title: "Items",
                  description:
                    "For coconuts and sportsballs only: use items when you know the number of coconuts or sportsballs produced",
                  hideNumber: true
                }
              ]
            }
          ]
        },
        {
          type: "matrixdropdown",
          name: "volumes_produced_matrix",
          title:
            "Record the conventional and organic volumes produced under Fairtrade certification in the last calendar/production year for each product. If production volume is estimated, please specify how you came to this estimate.",
          columns: [
            {
              name: "product_form_name",
              title: "What product form are you reporting your production in?",
              cellType: "dropdown",
              minWidth: "300px",
              choices: [
                {
                  value: 1,
                  text: "Arabica washed parchment"
                },
                {
                  value: 2,
                  text: "Arabica cherry"
                },
                {
                  value: 3,
                  text: "Baby bananas"
                },
                {
                  value: 4,
                  text: "Cocoa beans raw"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "volume_produced_unit",
              title: "What unit are you reporting your production in?",
              cellType: "dropdown",
              minWidth: "180px",
              choices: [
                {
                  value: "kg",
                  text: "kg"
                },
                {
                  value: "mt",
                  text: "MT"
                },
                {
                  value: "boxes_large",
                  text: "18.14 kg Boxes"
                },
                {
                  value: "boxes_small",
                  text: "13.5 kg Boxes"
                },
                {
                  value: "pound",
                  text: "Pound"
                },
                {
                  value: "quintales",
                  text: "Quintales (46 kg)"
                },
                {
                  value: "stems",
                  text: "Stems of flowers"
                },
                {
                  value: "1000stems",
                  text: "1000 stems of flowers"
                },
                {
                  value: "litres",
                  text: "Litres"
                },
                {
                  value: "items",
                  text: "Items"
                }
              ]
            },
            {
              name: "volume_conventional_produced",
              title: "Volume produced under conventional cultivation",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'organic_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "volume_organic_produced",
              title: "Volume produced under organic cultivation",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'conventional_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "volume_produced_estimated_or_measured",
              title: "Are the volumes reported actual or estimates?",
              cellType: "boolean",
              minWidth: "150px",
              defaultValue: "false",
              labelTrue: "Actual",
              labelFalse: "Estimates",
              showTitle: true
            },
            {
              name: "estimation_method",
              title: "Volumes were estimated based on:",
              cellType: "dropdown",
              minWidth: "200px",
              visibleIf: "{row.volume_produced_estimated_or_measured}=false",
              choices: [
                {
                  value: 1,
                  text: "Yields"
                },
                {
                  value: 2,
                  text: "Purchases from members",
                  visibleIf: "{producer_setup}='spo'"
                },
                {
                  value: 3,
                  text: "Fairtrade sales"
                },
                {
                  value: 4,
                  text: "Total sales"
                }
              ],
              storeOthersAsComment: true
            }
          ],
          rows: [
            {
              value: "Row 1",
              text: "[Minor category 1]"
            },
            {
              value: "Row 2",
              text: "[Minor category 2]"
            }
          ],
          rowTitleWidth: "200px"
        },
        {
          type: "matrixdropdown",
          name: "volumes_forecast_matrix",
          title:
            "How much of the total volume produced this year does your organization have on offer that is of export quality for Fairtrade sales? Record the conventional and organic volumes. If you have already started selling, record the volume your organization had on offer at the beginning of this calendar year.",
          columns: [
            {
              name: "product_form_name_forecast",
              title: "Production type",
              cellType: "dropdown",
              minWidth: "300px",
              choices: [
                {
                  value: 1,
                  text: "Arabica washed parchment"
                },
                {
                  value: 2,
                  text: "Arabica cherry"
                },
                {
                  value: 3,
                  text: "Baby bananas"
                },
                {
                  value: 4,
                  text: "Cocoa beans raw"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "volume_forecast_unit",
              title: "Unit",
              cellType: "dropdown",
              minWidth: "180px",
              choicesFromQuestion: "volume_produced_unit",
              choices: [
                {
                  value: "kg",
                  text: "kg"
                },
                {
                  value: "mt",
                  text: "MT"
                },
                {
                  value: "boxes_large",
                  text: "18.14 kg Boxes"
                },
                {
                  value: "boxes_small",
                  text: "13.5 kg Boxes"
                },
                {
                  value: "pound",
                  text: "Pound"
                },
                {
                  value: "quintales",
                  text: "Quintales (46 kg)"
                },
                {
                  value: "stems",
                  text: "Stems of flowers"
                },
                {
                  value: "1000stems",
                  text: "1000 stems of flowers"
                },
                {
                  value: "litres",
                  text: "Litres"
                },
                {
                  value: "items",
                  text: "Items"
                }
              ]
            },
            {
              name: "volume_conventional_forecast",
              title: "Conventional volume on offer",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'organic_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "volume_organic_forecast",
              title: "Organic volume on offer",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'conventional_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            }
          ],
          rows: [
            {
              value: "Row 1",
              text: "[Minor category 1]"
            },
            {
              value: "Row 2",
              text: "[Minor category 2]"
            }
          ],
          rowTitleWidth: "200px"
        }
      ],
      description: "Production"
    }
  ],
  checkErrorsMode: "onValueChanged"
};

function App() {
  const survey = new Model(surveyJson);
  survey.focusFirstQuestionAutomatic = false;

  const alertResults = useCallback((sender) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  survey.onComplete.add(alertResults);

  return <Survey model={survey} />;
}

export default App;
