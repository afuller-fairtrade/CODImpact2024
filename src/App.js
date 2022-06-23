import { useCallback } from "react";

import "survey-core/defaultV2.min.css";
// import 'survey-core/survey.min.css';
import { StylesManager, Model } from "survey-core";
import { Survey } from "survey-react-ui";
import ProductTree from "./ProductTree";

StylesManager.applyTheme("defaultV2");

function onAfterRenderQuestion(survey, options) {
  if (options.question.name === "major_product_category") {
    ProductTree.loadMajorCategories(options.question);
  }
}

function onDynamicPanelItemValueChanged(survey, options) {
  console.dir(options);
  switch (options.name) {
    case "major_product_category":
      ProductTree.filterMinorCategories(
        options.panel.getQuestionByName("minor_product_category"),
        options.value
      );
      break;
    case "minor_product_category":
      ProductTree.filterProductionTypes(
        options.panel.getQuestionByName("product_form_name"),
        options.value
      );
      break;
    default:
      break;
  }
}

const surveyJson = {
  version: 1,
  logoPosition: "right",
  focusOnFirstError: false,
  progressBarType: "buttons",
  showProgressBar: "top",
  pages: [
    {
      navigationTitle: "Start page",
      name: "Start page",
      elements: [
        {
          type: "panel",
          name: "panel1",
          elements: [
            {
              type: "text",
              name: "org_name",
              title:
                "[PRE-FILLED Placeholder for unique ID] Name of the organization:"
            },
            {
              type: "radiogroup",
              name: "producer_setup",
              title: "[PRE-FILLED] Choose your producer setup:",
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
              name: "survey_language",
              title: "[PRE-FILLED] Choose the language of the survey:",
              isRequired: true,
              choices: [
                {
                  value: "english",
                  text: "English"
                },
                {
                  value: "spanish",
                  text: "Spanish"
                },
                {
                  value: "portuguese",
                  text: "Portuguese"
                },
                {
                  value: "french",
                  text: "French"
                }
              ],
              defaultValue: "english"
            },
            {
              type: "radiogroup",
              name: "organic_logic",
              title:
                "For the last production cycle (2021-2022), was some or all of your production of Fairtrade crops also produced under an organic certification?",
              isRequired: true,
              choices: [
                {
                  value: "mixed",
                  text:
                    "Yes, some production was organic and some was conventional"
                },
                {
                  value: "organic_only",
                  text: "Yes, all production was also organic"
                },
                {
                  value: "conventional_only",
                  text: "No, all production was conventional"
                }
              ],
              defaultValue: "mixed"
            }
          ]
        }
      ],
      title: "Start Page"
    },
    {
      name: "Members",
      elements: [
        {
          type: "panel",
          name: "Number of farmers",
          elements: [
            {
              type: "panel",
              name: "farmers_conventional_panel",
              elements: [
                {
                  type: "text",
                  name: "farmers_conventional_total",
                  title: "Number of conventional farmers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number."
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{farmers_conventional_total} >= {farmers_conventional_female}+{farmers_conventional_male} OR {farmers_conventional_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_conventional_female",
                  visibleIf: "{farmers_conventional_gender_not_known} empty",
                  title: "Female conventional farmers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{farmers_conventional_total} >= {farmers_conventional_female}+{farmers_conventional_male} OR {farmers_conventional_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_conventional_male",
                  visibleIf: "{farmers_conventional_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Male conventional farmers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{farmers_conventional_total} >= {farmers_conventional_female}+{farmers_conventional_male} OR {farmers_conventional_male} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "farmers_conventional_gender_not_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of conventional farmers by gender"
                    }
                  ]
                }
              ],
              visibleIf: "{organic_logic} anyof ['mixed', 'conventional_only']"
            },
            {
              type: "panel",
              name: "farmers_organic_panel",
              elements: [
                {
                  type: "text",
                  name: "farmers_organic_total",
                  startWithNewLine: false,
                  title: "Number of organic farmers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number."
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{farmers_organic_total} >= {farmers_organic_female}+{farmers_organic_male} OR {farmers_organic_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_organic_female",
                  visibleIf: "{farmers_organic_gender_not_known} empty",
                  title: "Female organic farmers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{farmers_organic_total} >= {farmers_organic_female}+{farmers_organic_male} OR {farmers_organic_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_organic_male",
                  visibleIf: "{farmers_organic_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Male organic farmers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{farmers_organic_total} >= {farmers_organic_female}+{farmers_organic_male} OR {farmers_organic_male} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "farmers_organic_gender_not_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of organic farmers by gender"
                    }
                  ]
                }
              ],
              visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
              startWithNewLine: false
            }
          ],
          title:
            "Record the number of farmers that are members of your organization. Count each member only once. Consider members in transition, or members that produce both conventional and organic, as organic."
        },
        {
          type: "panel",
          name: "summary_number_of_farmers",
          elements: [
            {
              type: "expression",
              name: "farmers_total",
              title: "Summary of total farmers:",
              hideNumber: true,
              expression: "{farmers_conventional_total}+{farmers_organic_total}"
            },
            {
              type: "expression",
              name: "farmers_female",
              title: "Summary of total female farmers:",
              hideNumber: true,
              expression:
                "{farmers_conventional_female}+{farmers_organic_female}"
            },
            {
              type: "expression",
              name: "farmers_male",
              startWithNewLine: false,
              title: "Summary of total male farmers:",
              hideNumber: true,
              expression: "{farmers_conventional_male}+{farmers_organic_male}"
            }
          ],
          title: "Summary of number of farmers reported"
        }
      ],
      title: "Number of members of your organization",
      navigationTitle: "Members",
      /*navigationDescription: "of your organization",*/
      visibleIf: "{producer_setup} = 'spo'"
    },
    {
      name: "Young people (SPOs)",
      elements: [
        {
          type: "panel",
          name: "Number of farmers by age",
          elements: [
            {
              type: "checkbox",
              name: "farmers_age_not_known",
              title:
                "Do you know the number of your organization's members by age groups?",
              titleLocation: "hidden",
              hideNumber: true,
              choices: [
                {
                  value: "not_known",
                  text:
                    "Please check here if you do not know the number of your organization's members by age groups"
                }
              ]
            },
            {
              type: "panel",
              name: "report_number_farmers_panel",
              elements: [
                {
                  type: "panel",
                  name: "Number of farmers age 16 to 28 years old",
                  elements: [
                    {
                      type: "text",
                      name: "total_farmers_16_28",
                      title: "Total number of farmers age 16 to 28",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_16_28} >= {farmers_female_16_28}+{farmers_male_16_28} OR {total_farmers_16_28} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of farmers reported by age is more than the number of farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_16_28} empty"
                        }
                      ]
                    },
                    {
                      type: "text",
                      name: "farmers_female_16_28",
                      visibleIf: "{farmers_gender_not_known_16_28} empty",
                      title: "Number of female farmers",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_16_28} >= {farmers_female_16_28}+{farmers_male_16_28} OR {farmers_female_16_28} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of female farmers reported by age is more than the number of female farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_female_total} <= {farmers_female} OR {farmers_female_16_28} empty"
                        }
                      ]
                    },
                    {
                      type: "text",
                      name: "farmers_male_16_28",
                      visibleIf: "{farmers_gender_not_known_16_28} empty",
                      startWithNewLine: false,
                      title: "Number of male farmers",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_16_28} >= {farmers_female_16_28}+{farmers_male_16_28} OR {farmers_male_16_28} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of male farmers reported by age is more than the number of male farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_male_total} <= {farmers_male} OR {farmers_male_16_28} empty"
                        }
                      ]
                    },
                    {
                      type: "checkbox",
                      name: "farmers_gender_not_known_16_28",
                      title:
                        "Do you know the number of female and male farmers?",
                      titleLocation: "hidden",
                      hideNumber: true,
                      choices: [
                        {
                          value: "not_known",
                          text:
                            "Please check here if you do not know the number of female and male farmers 16 to 28 years old"
                        }
                      ]
                    }
                  ],
                  title: "Number of farmers age 16 to 28 years old"
                },
                {
                  type: "panel",
                  name: "Number of farmers age 29 to 35 years old",
                  elements: [
                    {
                      type: "text",
                      name: "total_farmers_29_35",
                      title: "Total number of farmers age 29 to 35",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_29_35} >= ({farmers_female_29_35}+{farmers_male_29_35}) OR {total_farmers_29_35} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of farmers reported by age is more than the number of farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_29_35} empty"
                        }
                      ]
                    },
                    {
                      type: "text",
                      name: "farmers_female_29_35",
                      visibleIf: "{farmers_gender_not_known_29_35} empty",
                      title: "Number of female farmers",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_29_35} >= ({farmers_female_29_35}+{farmers_male_29_35}) OR {farmers_female_29_35} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of female farmers reported by age is more than the number of female farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_female_total} <= {farmers_female} OR {farmers_female_29_35} empty"
                        }
                      ]
                    },
                    {
                      type: "text",
                      name: "farmers_male_29_35",
                      visibleIf: "{farmers_gender_not_known_29_35} empty",
                      startWithNewLine: false,
                      title: "Number of male farmers",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_29_35} >= ({farmers_female_29_35}+{farmers_male_29_35}) OR {farmers_male_29_35} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of male farmers reported by age is more than the number of male farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_male_total} <= {farmers_male} OR {farmers_male_29_35} empty"
                        }
                      ]
                    },
                    {
                      type: "checkbox",
                      name: "farmers_gender_not_known_29_35",
                      title:
                        "Do you know the number of female and male farmers?",
                      titleLocation: "hidden",
                      hideNumber: true,
                      choices: [
                        {
                          value: "not_known",
                          text:
                            "Please check here if you do not know the number of female and male farmers 29 to 35 years old"
                        }
                      ]
                    }
                  ],
                  title: "Number of farmers age 29 to 35 years old"
                },
                {
                  type: "panel",
                  name: "Number of farmers age 36 years or older",
                  elements: [
                    {
                      type: "text",
                      name: "total_farmers_36",
                      title: "Total number of farmers 36 years or older",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_36} >= {farmers_female_36}+{farmers_male_36} OR {total_farmers_36} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of farmers reported by age is more than the number of farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_36} empty"
                        }
                      ]
                    },
                    {
                      type: "text",
                      name: "farmers_female_36",
                      visibleIf: "{farmers_gender_not_known_36} empty",
                      title: "Number of female farmers",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_36} >= {farmers_female_36}+{farmers_male_36} OR {farmers_female_36} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of female farmers reported by age is more than the number of female farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_female_total} <= {farmers_female} OR {farmers_female_36} empty"
                        }
                      ]
                    },
                    {
                      type: "text",
                      name: "farmers_male_36",
                      visibleIf: "{farmers_gender_not_known_36} empty",
                      startWithNewLine: false,
                      title: "Number of male farmers",
                      hideNumber: true,
                      validators: [
                        {
                          type: "numeric",
                          text: "Please enter a valid number"
                        },
                        {
                          type: "expression",
                          text:
                            "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                          expression:
                            "{total_farmers_36} >= {farmers_female_36}+{farmers_male_36} OR {farmers_male_36} empty"
                        },
                        {
                          type: "expression",
                          text:
                            "The number of male farmers reported by age is more than the number of male farmers reported on the previous page. Please fix.",
                          expression:
                            "{RO_farmers_age_male_total} <= {farmers_male} OR {farmers_male_36} empty"
                        }
                      ]
                    },
                    {
                      type: "checkbox",
                      name: "farmers_gender_not_known_36",
                      title:
                        "Do you know the number of female and male farmers?",
                      titleLocation: "hidden",
                      choices: [
                        {
                          value: "not_known",
                          text:
                            "Please check here if you do not know the number of female and male farmers 36 years or old"
                        }
                      ]
                    }
                  ],
                  title: "Number of farmers age 36 years or older"
                },
                {
                  type: "panel",
                  name: "Summary of farmers reported",
                  elements: [
                    {
                      type: "expression",
                      name: "RO_farmers_age_total",
                      title: "Summary of total farmers reported:",
                      hideNumber: true,
                      expression:
                        "{total_farmers_16_28}+{total_farmers_29_35}+{total_farmers_36}"
                      /* validators: [
                          {
                            type: "expression",
                            text: "The number of farmers reported by age is more than the number of farmers reported on the previous page. Please fix.",
                            expression: "{RO_farmers_age_total} <= {farmers_total}"
                          }
                        ]*/
                    },
                    {
                      type: "expression",
                      name: "RO_farmers_age_female_total",
                      title: "Summary of female farmers reported:",
                      hideNumber: true,
                      expression:
                        "{farmers_female_16_28}+{farmers_female_29_35}+{farmers_female_36}"
                      /*validators: [
                          {
                            type: "expression",
                            text: "The number of female farmers reported by age is more than the number of female farmers reported on the previous page. Please fix.",
                            expression: "{RO_farmers_age_female_total} <= {farmers_female}"
                          }
                        ]*/
                    },
                    {
                      type: "expression",
                      name: "RO_farmers_age_male_total",
                      title: "Summary of male farmers reported:",
                      hideNumber: true,
                      startWithNewLine: false,
                      expression:
                        "{farmers_male_16_28}+{farmers_male_29_35}+{farmers_male_36}"
                      /* validators: [
                          {
                            type: "expression",
                            text: "The number of male farmers reported by age is more than the number of male farmers reported on the previous page. Please fix.",
                            expression: "{RO_farmers_age_male_total} <= {farmers_male}"
                          }
                        ]*/
                    }
                  ],
                  title: "Summary of farmers reported"
                }
              ],
              visibleIf: "{farmers_age_not_known} empty"
            }
          ],
          title:
            "Record the number of farmers that are members of your organization, by age group."
        }
      ],
      visibleIf: "{producer_setup} = 'spo'",
      title: "Number of young people as members of your organization",
      navigationTitle: "Young people"
      /*navigationDescription: "in your organization"*/
    },
    {
      name: "Workers",
      elements: [
        {
          type: "panel",
          name: "Info box workers",
          elements: [
            {
              type: "html",
              name: "info_box_spo_only",
              visibleIf: "{producer_setup} = 'spo'",
              hideNumber: true,
              html:
                "<br>This section applies <b>only to those workers hired by your organization directly.</b> Workers hired by individual SPO members that work on farms should <i>not</i> be counted in this section."
            },
            {
              type: "html",
              name: "info_box2",
              hideNumber: true,
              html:
                "<br>Workers are defined as all waged employees including migrant, temporary, seasonal, sub-contracted and permanent workers. Workers include all hired personnel whether they work in the field, in processing sites, or in administration. The term is restricted to personnel that can be unionised and therefore middle and senior and other professionals are generally not considered workers. For all types of workers, employment refers to any activity that one performs to produce goods or provide services for pay or profit.The following definitions of types of workers apply:<br><br><b>Permanent workers:</b> A permanent worker is a worker that has an employment relationship with the company/organization for an indefinite period of time.<br><br><b>Fixed-term workers:</b> A fixed-term (or temporary) worker is a worker that has an employment relationship with the company/organization that automatically ends or may be extended after a certain duration previously agreed with the employer.<br><br><b>Sub-contracted worker:</b> A sub-contracted worker is a worker employed and paid by a third party, usually a labour broker, to provide labour to a third party in exchange for a fee that is collected by the broker.<br><br><b>Seasonal worker:</b> A seasonal worker is a worker that provides labour during certain seasons, usually during harvesting. Seasonal workers may be directly employed (usually as a fixed-term worker) or sub-contracted."
            }
          ]
        },
        {
          type: "panel",
          name: "Number of workers",
          elements: [
            {
              type: "panel",
              name: "workers_permanent_panel",
              title:
                "Record the number of workers employed by your organization in the last calendar year with the following types of employment contracts.",
              elements: [
                {
                  type: "text",
                  name: "workers_permanent_total",
                  title:
                    "Number of permanent workers employed by your organization",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_permanent} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_permanent_female",
                  visibleIf: "{permanent_gender_not_known} empty",
                  title: "Female permanent workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_permanent} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_permanent_male",
                  visibleIf: "{permanent_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Male permanent workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_permanent} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_male} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "permanent_gender_not_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of permanent workers by gender"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "workers_fixedterm_panel",
              elements: [
                {
                  type: "text",
                  name: "workers_fixed_term_total",
                  title:
                    "Number of fixed-term workers employed by your organization",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_fixed_term} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_fixed_term_female",
                  visibleIf: "{workers_fixedterm_gender_not_known} empty",
                  title: "Female fixed-term workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_fixed_term} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_fixed_term_male",
                  visibleIf: "{workers_fixedterm_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Male fixed-term workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_fixed_term} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_male} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "workers_fixedterm_gender_not_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of fixed-term workers by gender"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "workers_subcontractor_panel",
              elements: [
                {
                  type: "text",
                  name: "workers_subcontractor_total",
                  title:
                    "Number of sub-contracted workers employed by your organization",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_subcontractor} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_subcontractor_female",
                  visibleIf: "{workers_subcontractor_gender_not_known} empty",
                  title: "Female sub-contracted workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_subcontractor} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_subcontractor_male",
                  visibleIf: "{workers_subcontractor_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Male sub-contracted workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_subcontractor} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_male} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "workers_subcontractor_gender_not_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of sub-contracted workers by gender"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "summary_number_of_workers",
              elements: [
                {
                  type: "expression",
                  name: "workers_total",
                  title: "Summary of total workers:",
                  hideNumber: true,
                  expression:
                    "{workers_permanent_total}+{workers_fixed_term_total}+{workers_subcontractor_total}"
                },
                {
                  type: "expression",
                  name: "workers_female",
                  title: "Summary of total female workers:",
                  hideNumber: true,
                  expression:
                    "{workers_permanent_female}+{workers_fixed_term_female}+{workers_subcontractor_female}"
                },
                {
                  type: "expression",
                  name: "workers_male",
                  startWithNewLine: false,
                  title: "Summary of total male workers:",
                  hideNumber: true,
                  expression:
                    "{workers_permanent_male}+{workers_fixed_term_male}+{workers_subcontractor_male}"
                },
                {
                  type: "expression",
                  name: "workers_seasonal_max_hidden",
                  visible: false,
                  title: "Max number of seasonal workers",
                  hideNumber: true,
                  expression: "{workers_fixed_term}+{workers_subcontractor}"
                }
              ],
              title: "Summary of number of workers reported"
            }
          ]
        }
      ],
      title: "Number of workers employed by your organization",
      navigationTitle: "Workers"
      /*navigationDescription: "employed by your organization"*/
    },
    {
      name: "Seasonal workers",
      elements: [
        {
          type: "panel",
          name: "Info box workers",
          elements: [
            {
              type: "html",
              name: "info_box_spo_only",
              visibleIf: "{producer_setup} = 'spo'",
              hideNumber: true,
              html:
                "<br>This section applies <b>only to those workers hired by your organization directly.</b> Workers hired by individual SPO members that work on farms should <i>not</i> be counted in this section."
            },
            {
              type: "html",
              name: "info_box2",
              hideNumber: true,
              html:
                "<br>Workers are defined as all waged employees including migrant, temporary, seasonal, sub-contracted and permanent workers. Workers include all hired personnel whether they work in the field, in processing sites, or in administration. The term is restricted to personnel that can be unionised and therefore middle and senior and other professionals are generally not considered workers. For all types of workers, employment refers to any activity that one performs to produce goods or provide services for pay or profit.The following definitions of types of workers apply:<br><br><b>Seasonal worker:</b> A seasonal worker is a worker that provides labour during certain seasons, usually during harvesting. Seasonal workers may be directly employed (usually as a fixed-term worker) or sub-contracted."
            }
          ]
        },
        {
          type: "panel",
          name: "workers_seasonal_panel",
          elements: [
            {
              type: "text",
              name: "workers_seasonal_total",
              title:
                "Of the {workers_seasonal_max_hidden} fixed-term and sub-contracted workers hired by your organization, how many are seasonal workers?",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                },
                {
                  type: "expression",
                  text:
                    "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                  expression:
                    "{workers_seasonal_total} >= {workers_seasonal_female}+{workers_seasonal_male} OR {workers_seasonal_total} empty"
                }
              ]
            },
            {
              type: "text",
              name: "workers_seasonal_female",
              visibleIf: "{workers_seasonal_gender_not_known} empty",
              title: "Female seasonal workers",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                },
                {
                  type: "expression",
                  text:
                    "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                  expression:
                    "{workers_seasonal_total} >= {workers_seasonal_female}+{workers_seasonal_male} OR {workers_seasonal_female} empty"
                }
              ]
            },
            {
              type: "text",
              name: "workers_seasonal_male",
              visibleIf: "{workers_seasonal_gender_not_known} empty",
              startWithNewLine: false,
              title: "Male seasonal workers",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                },
                {
                  type: "expression",
                  text:
                    "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                  expression:
                    "{workers_seasonal_total} >= {workers_seasonal_female}+{workers_seasonal_male} OR {workers_seasonal_male} empty"
                }
              ]
            },
            {
              type: "checkbox",
              name: "workers_seasonal_gender_not_known",
              titleLocation: "hidden",
              hideNumber: true,
              choices: [
                {
                  value: "not_known",
                  text:
                    "Please check here if you do not know the number of seasonal workers by gender"
                }
              ]
            }
          ],
          title: "Seasonal workers hired by your organization"
        }
      ],
      title: "Number of seasonal workers employed by your organization",
      navigationTitle: "Seasonal workers"
      /*navigationDescription: "employed by your organization"*/
    },
    {
      name: "Young people (HL)",
      elements: [
        {
          type: "expression",
          name: "question54",
          visibleIf: "{producer_setup} = 'hlo'",
          title:
            "Record the number of workers hired by your organization, by age group.",
          hideNumber: true
        },
        {
          type: "checkbox",
          name: "workers_age_not_known",
          visibleIf: "{producer_setup} = 'hlo'",
          titleLocation: "hidden",
          hideNumber: true,
          choices: [
            {
              value: "not_known",
              text:
                "Please check here if you do not know the number of workers by age groups"
            }
          ]
        },
        {
          type: "panel",
          name: "Number of workers by age",
          elements: [
            {
              type: "panel",
              name: "Number of workers age 16 to 28 years old",
              elements: [
                {
                  type: "text",
                  name: "total_workers_16_28",
                  title: "Total number of workers age 16 to 28",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_16_28} >= {workers_female_16_28}+{workers_male_16_28} OR {total_workers_16_28} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of workers reported by age is more than the number of workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_total} <= {workers_total} OR {total_workers_16_28} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_female_16_28",
                  visibleIf: "{workers_gender_not_known_16_28} empty",
                  title: "Number of female workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_16_28} >= {workers_female_16_28}+{workers_male_16_28} OR {workers_female_16_28} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of female workers reported by age is more than the number of female workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_female_total} <= {workers_female} OR {workers_female_16_28} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_male_16_28",
                  visibleIf: "{workers_gender_not_known_16_28} empty",
                  startWithNewLine: false,
                  title: "Number of male workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_16_28} >= {workers_female_16_28}+{workers_male_16_28} OR {workers_male_16_28} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of male workers reported by age is more than the number of male workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_male_total} <= {workers_male} OR {workers_male_16_28} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "workers_gender_not_known_16_28",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of female and male workers 16 to 28 years old"
                    }
                  ]
                }
              ],
              title: "Number of workers age 16 to 28 years old"
            },
            {
              type: "panel",
              name: "Number of workers age 29 to 35 years old",
              elements: [
                {
                  type: "text",
                  name: "total_workers_29_35",
                  title: "Total number of workers age 29 to 35",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_29_35} >= {workers_female_29_35}+{workers_male_29_35} OR {total_workers_29_35} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of workers reported by age is more than the number of workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_total} <= {workers_total} OR {total_workers_29_35} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_female_29_35",
                  visibleIf: "{workers_gender_not_known_29_35} empty",
                  title: "Number of female workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_29_35} >= {workers_female_29_35}+{workers_male_29_35} OR {workers_female_29_35} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of female workers reported by age is more than the number of female workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_female_total} <= {workers_female} OR {workers_female_29_35} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_male_29_35",
                  visibleIf: "{workers_gender_not_known_29_35} empty",
                  startWithNewLine: false,
                  title: "Number of male workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{workers_seasonal_total} >= {workers_seasonal_female}+{workers_seasonal_male} OR {workers_male_29_35} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of male workers reported by age is more than the number of male workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_male_total} <= {workers_male} OR {workers_male_29_35} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "workers_gender_not_known_29_35",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of female and male workers 29 to 35 years old"
                    }
                  ]
                }
              ],
              title: "Number of workers age 29 to 35 years old"
            },
            {
              type: "panel",
              name: "Number of workers age 36 years or older",
              elements: [
                {
                  type: "text",
                  name: "total_workers_36",
                  title: "Total number of workers 36 years or older",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_36} >= {workers_female_36}+{workers_male_36} OR {total_workers_36} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of workers reported by age is more than the number of workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_total} <= {workers_total} OR {total_workers_29_35} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_female_36",
                  visibleIf: "{workers_gender_not_known_36} empty",
                  title: "Number of female workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_36} >= {workers_female_36}+{workers_male_36} OR {workers_female_36} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of female workers reported by age is more than the number of female workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_female_total} <= {workers_female} OR {workers_female_36} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_male_36",
                  visibleIf: "{workers_gender_not_known_36} empty",
                  startWithNewLine: false,
                  title: "Number of male workers",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male farmers is correct. If not, please adjust the numbers you recorded.",
                      expression:
                        "{total_workers_36} >= {workers_female_36}+{workers_male_36} OR {workers_male_36} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The number of male workers reported by age is more than the number of male workers reported on the previous page. Please fix.",
                      expression:
                        "{RO_workers_age_male_total} <= {workers_male} OR {workers_male_36} empty"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "workers_gender_not_known_36",
                  titleLocation: "hidden",
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of female and male workers 36 years or older"
                    }
                  ]
                }
              ],
              title: "Number of workers age 36 years or older"
            },
            {
              type: "panel",
              name: "Summary of workers reported",
              elements: [
                {
                  type: "expression",
                  name: "RO_workers_age_total",
                  title: "Summary of total workers reported:",
                  hideNumber: true,
                  expression:
                    "{total_workers_16_28}+{total_workers_29_35}+{total_workers_36}"
                  /* validators: [
                       {
                         type: "expression",
                        text: "The number of workers reported by age is more than the number of workers reported on the previous page. Please fix.",
                        expression: "{RO_workers_age_total} <= {workers_total}"
                       }
                     ]*/
                },
                {
                  type: "expression",
                  name: "RO_workers_age_female_total",
                  title: "Summary of female workers reported:",
                  hideNumber: true,
                  expression:
                    "{workers_female_16_28}+{workers_female_29_35}+{workers_female_36}"
                  /* validators: [
                       {
                         type: "expression",
                        text: "The number of female workers reported by age is more than the number of female workers reported on the previous page. Please fix.",
                        expression: "{RO_workers_age_female_total} <= {workers_female}"
                       }
                     ]*/
                },
                {
                  type: "expression",
                  name: "RO_workers_age_male_total",
                  title: "Summary of male workers reported:",
                  hideNumber: true,
                  startWithNewLine: false,
                  expression:
                    "{workers_male_16_28}+{workers_male_29_35}+{workers_male_36}"
                  /* validators: [
                       {
                         type: "expression",
                        text: "The number of male workers reported by age is more than the number of male workers reported on the previous page. Please fix.",
                        expression: "{RO_workers_age_male_total} <= {workers_male}"
                       }
                     ]*/
                }
              ],
              title: "Summary of workers reported"
            }
          ],
          visibleIf: "{workers_age_not_known} empty"
        }
      ],
      visibleIf: "{producer_setup} = 'hlo'",
      title: "Number of young people employed by your organization",
      navigationTitle: "Young people"
      /*navigationDescription: "employed by your organization"*/
    },
    {
      name: "Total Land Area",
      title: "Land area under cultivation by your organization",
      elements: [
        {
          type: "radiogroup",
          name: "land_area_unit",
          title: "In what unit would you like to report your land area?",
          hideNumber: true,
          isRequired: true,
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
              hideNumber: true,
              title:
                "How many {land_area_unit} of land are under cultivation by all SPO members? Please report here land under cultivation of both Fairtrade and non-Fairtrade certified crops. ",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                },
                {
                  type: "expression",
                  text:
                    "Fairtrade land area is larger than total land area. Please fix.",
                  expression:
                    "{total_land_managed} >= {total_area_ft_certification} OR {total_land_managed} empty"
                }
              ],
              visibleIf: "{producer_setup} = 'spo'"
            },
            {
              type: "text",
              name: "total_area_ft_certification",
              hideNumber: true,
              title:
                "How many {land_area_unit} of land are under cultivation of Fairtrade crops within your organization?",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                },
                {
                  type: "expression",
                  text:
                    "Fairtrade land area is larger than total land area. Please fix.",
                  expression:
                    "{producer_setup} = 'hlo' OR {producer_setup} = 'spo' AND ({total_land_managed} >= {total_area_ft_certification} OR {total_area_ft_certification} empty OR {total_land_managed} empty)"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "product_page",
      navigationTitle: "Products",
      title: "Products produced by your organization on Fairtrade terms",
      elements: [
        {
          type: "paneldynamic",
          name: "products_panel",
          title:
            "In this section, please report on the products that your organization produced according to the Fairtrade standards in the most recent production cycle (2021-2022). For each product, you will be asked to report the land area under cultivation by your organization and the volume produced. In addition, you will be asked to report the forecast volumes for the upcoming production cycle (2022-2023) if applicable.",
          hideNumber: true,
          templateElements: [
            {
              type: "dropdown",
              name: "major_product_category",
              title:
                "Please select the product category from the dropdown that corresponds to your Fairtrade product certification:",
              hideNumber: true,
              isRequired: true,
              choices: ["item1", "item2"]
            },
            {
              type: "dropdown",
              name: "minor_product_category",
              title:
                "Please select the product from the dropdown that your organization produced under Fairtrade certification",
              visibleIf: "{panel.major_product_category} notempty",
              hideNumber: true,
              isRequired: true,
              choices: ["item1", "item2"]
            },
            {
              type: "panel",
              name: "land_area_panel",
              elements: [
                {
                  type: "text",
                  name: "land_total_production",
                  visibleIf: "{panel.land_area_known} empty",
                  hideNumber: true,
                  title:
                    "How many total {land_area_unit} of land was cultivated with {panel.major_product_category} ({panel.minor_product_category})?",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "land_area_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the total land area for this product"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "land_conventional_production",
                  title:
                    "How many {land_area_unit} of land was under conventional cultivation?",
                  visibleIf:
                    "{organic_logic} anyof ['mixed', 'conventional_only'] AND {panel.conventional_organic_area_known} empty",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text: "Does not match total, please fix.",
                      expression:
                        "{panel.land_total_production} empty OR {panel.land_total_production} >= ({panel.land_conventional_production}+{panel.land_organic_production})"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "land_organic_production",
                  title:
                    "How many {land_area_unit} of land was under cultivation of organic certification?",
                  visibleIf:
                    "{organic_logic} anyof ['mixed', 'organic_only'] AND {panel.conventional_organic_area_known} empty",
                  hideNumber: true,
                  startWithNewLine: false,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text: "Does not match total, please fix.",
                      expression:
                        "{panel.land_total_production} empty OR {panel.land_total_production} >= ({panel.land_conventional_production}+{panel.land_organic_production})"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "conventional_organic_area_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  visibleIf: "{organic_logic} = 'mixed'",
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the {land_area_unit} of organic and conventional land area for this product"
                    }
                  ]
                }
              ],
              visibleIf: "{panel.minor_product_category} notempty",
              title: "Land area under Fairtrade cultivation, by product"
            },
            {
              type: "panel",
              name: "panel_volumes_produced",
              elements: [
                {
                  type: "dropdown",
                  name: "product_form_name",
                  hideNumber: true,
                  isRequired: true,
                  title:
                    "In what product form would you like to report your organization's {panel.minor_product_category} production?",
                  choices: []
                },
                {
                  type: "dropdown",
                  name: "volume_produced_unit",
                  hideNumber: true,
                  isRequired: true,
                  startWithNewLine: false,
                  title:
                    "In what unit would you like to report your organization's {panel.minor_product_category} production?",
                  choices: [
                    "kg",
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
                  type: "text",
                  name: "volume_conventional_produced",
                  hideNumber: true,
                  visibleIf:
                    "{organic_logic} anyof ['mixed', 'conventional_only']",
                  title:
                    "How many {panel.volume_produced_unit} of {panel.product_form_name} did your organization produce under conventional cultivation?",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "volume_organic_produced",
                  startWithNewLine: false,
                  hideNumber: true,
                  visibleIf: "{organic_logic} anyof ['mixed', 'organic_only']",
                  title:
                    "How many {panel.volume_produced_unit} of {panel.product_form_name} did your organization produce under organic certification?",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "boolean",
                  name: "volume_produced_estimated_or_measured",
                  title: "Are the volumes reported actual or estimates?",
                  hideNumber: true,
                  defaultValue: "true",
                  labelTrue: "Estimates",
                  labelFalse: "Actual"
                },
                {
                  type: "dropdown",
                  name: "volume_produced_estimated_how",
                  title: "What was the estimated volume based on?",
                  startWithNewLine: false,
                  hideNumber: true,
                  visibleIf:
                    "{panel.volume_produced_estimated_or_measured} = true",
                  choices: [
                    {
                      value: "yields",
                      text: "Yields"
                    },
                    {
                      value: "FT_sales",
                      text: "Fairtrade Sales"
                    },
                    {
                      value: "total_sales",
                      text: "Total sales"
                    },
                    {
                      value: "other",
                      text: "Other (specify in comments)"
                    }
                  ]
                }
              ],
              visibleIf: "{panel.minor_product_category} notempty",
              title: "Volumes Produced on Fairtrade terms"
            },
            {
              type: "panel",
              name: "summary_production_yields",
              elements: [
                {
                  type: "expression",
                  name: "volume_produced_total__calc",
                  title: "Total volume produced:",
                  hideNumber: true,
                  expression:
                    "{panel.volume_organic_produced}+{panel.volume_conventional_produced}",
                  displayStyle: "decimal"
                },
                {
                  type: "expression",
                  name: "total_yields_calc",
                  title:
                    "Estimated total yields of {panel.product_form_name} in {panel.volume_produced_unit}/{land_area_unit}",
                  hideNumber: true,
                  startWithNewLine: false,
                  expression:
                    "({panel.volume_organic_produced}+{panel.volume_conventional_produced})/{panel.land_total_production}",
                  visibleIf: "{panel.land_total_production} notempty",
                  displayStyle: "decimal"
                },
                {
                  type: "expression",
                  name: "conventional_yields_calc",
                  title:
                    "Estimated conventional yields of {panel.product_form_name} in {panel.volume_produced_unit}/{land_area_unit}",
                  hideNumber: true,
                  expression:
                    "{panel.volume_conventional_produced}/{panel.land_conventional_production}",
                  visibleIf:
                    "{panel.land_conventional_production} notempty AND {organic_logic} anyof ['mixed', 'conventional_only']",
                  displayStyle: "decimal"
                },
                {
                  type: "expression",
                  name: "organic_yields_calc",
                  title:
                    "Estimated organic yields of {panel.product_form_name} in {panel.volume_produced_unit}/{land_area_unit}",
                  hideNumber: true,
                  startWithNewLine: false,
                  expression:
                    "{panel.volume_organic_produced}/{panel.land_organic_production}",
                  visibleIf:
                    "{panel.land_organic_production} notempty AND {organic_logic} anyof ['mixed', 'organic_only']",
                  displayStyle: "decimal"
                }
              ],
              visibleIf: "{panel.minor_product_category} notempty",
              title:
                "Summary of production and yields for {panel.major_product_category} ({panel.minor_product_category})"
            },
            {
              type: "panel",
              name: "panel_volumes_forecast",
              elements: [
                {
                  type: "dropdown",
                  name: "volume_forecast_unit",
                  hideNumber: true,
                  isRequired: true,
                  startWithNewLine: false,
                  title:
                    "In what unit would you like to report your organization's {panel.minor_product_category} volume on offer/ forecast?",
                  choices: [
                    "kg",
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
                  ],
                  visibleIf: "{panel.volume_forecast_known} empty"
                },
                {
                  type: "text",
                  name: "volume_conventional_forecast",
                  hideNumber: true,
                  title:
                    "How many {panel.volume_forecast_unit} of {panel.product_form_name} produced under conventional cultivation does your organization forecast will be of export quality?",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ],
                  visibleIf: "{panel.volume_forecast_known} empty"
                },
                {
                  type: "text",
                  name: "volume_organic_forecast",
                  hideNumber: true,
                  startWithNewLine: false,
                  title:
                    "How many {panel.volume_forecast_unit} of {panel.product_form_name} produced under organic certification does your organization forecast will be of export quality?",
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ],
                  visibleIf: "{panel.volume_forecast_known} empty"
                },
                {
                  type: "checkbox",
                  name: "volume_forecast_known",
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the forecast volume for this product or this question is not applicable"
                    }
                  ]
                }
              ],
              visibleIf: "{panel.minor_product_category} notempty",
              title:
                "Volumes produced on Fairtrade terms on offer (that are of export quality for Fairtrade sales)"
            }
          ],
          noEntriesText:
            "You have not entered any products yet.\nClick the button below to start.",
          confirmDelete: true,
          confirmDeleteText: "Are you sure you want to delete this product?",
          panelAddText: "Add Product",
          panelRemoveText: "Remove this product",
          panelPrevText: "Previous product",
          panelNextText: "Next product",
          showQuestionNumbers: "onPanel",
          renderMode: "progressTopBottom"
        },
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
        }
      ]
    },
    {
      navigationTitle: "Summary",
      name: "Summary report",
      title: "Summary report",
      elements: [
        {
          type: "html",
          name: "info_box_summary_page",
          hideNumber: true,
          html:
            "Before submitting your report, please take a few minutes to review that the information you reported is correct. If you notice any mistakes, please return to the corresponding page to correct them."
        },
        {
          type: "panel",
          name: "organization_members_summary",
          title: "Summary of number of members in your organization:",
          visibleIf: "{producer_setup} = 'spo'",
          elements: [
            {
              type: "html",
              name: "total_number_of_farmers_summary",
              hideNumber: true,
              html:
                "<br><b>You have reported that your organization has:</b><br>{farmers_total} total members, with<br>{farmers_conventional_total} conventional farmers and<br>{farmers_organic_total} organic farmers."
            },
            {
              type: "html",
              name: "total_number_of_farmers_by_gender_summary",
              hideNumber: true,
              startWithNewLine: false,
              html:
                "<br><b>Of the {farmers_total} total members in your organization, you reported that:</b><br>{farmers_female} are female and<br>{farmers_male} are male."
            }
          ]
        },
        {
          type: "panel",
          name: "youth_membership_summary",
          title:
            "Summary of number of young people as members of your organization:",
          visibleIf:
            "{producer_setup} = 'spo' AND {farmers_age_not_known} empty",
          elements: [
            {
              type: "html",
              name: "number_of_farmers_16_28_summary",
              hideNumber: true,
              visibleIf: "{farmers_gender_not_known_16_28} empty",
              html:
                "<br><b>Number of members between the ages of 16 and 28 years old:</b> {total_farmers_16_28}<br>Of which {farmers_female_16_28} are female and {farmers_male_16_28} are male"
            },
            {
              type: "html",
              name: "number_of_farmers_16_28_summary",
              hideNumber: true,
              startWithNewLine: false,
              visibleIf: "{farmers_gender_not_known_16_28} notempty",
              html:
                "<br><b>Number of members between the ages of 16 and 28 years old:</b> {total_farmers_16_28}<br>The number of male and female members were not reported"
            },
            {
              type: "html",
              name: "number_of_farmers_29_35_summary",
              hideNumber: true,
              visibleIf: "{farmers_gender_not_known_29_35} empty",
              startWithNewLine: false,
              html:
                "<br><b>Number of members between the ages of 29 and 35 years old:</b> {total_farmers_29_35}<br>Of which {farmers_female_29_35} are female and {farmers_male_29_35} are male"
            },
            {
              type: "html",
              name: "number_of_farmers_29_35_summary",
              hideNumber: true,
              visibleIf: "{farmers_gender_not_known_29_35} notempty",
              startWithNewLine: false,
              html:
                "<br><b>Number of members between the ages of 29 and 35 years old:</b> {total_farmers_29_35}<br>The number of male and female members were not reported"
            },
            {
              type: "html",
              name: "number_of_farmers_36_summary",
              hideNumber: true,
              startWithNewLine: false,
              visibleIf: "{farmers_gender_not_known_36} empty",
              html:
                "<br><b>Number of members 36 years of age or older:</b> {total_farmers_36}<br>Of which {farmers_female_36} are female and {farmers_male_36} are male"
            },
            {
              type: "html",
              name: "number_of_farmers_36_summary",
              hideNumber: true,
              visibleIf: "{farmers_gender_not_known_36} notempty",
              html:
                "<br><b>Number of members 36 years of age or older:</b> {total_farmers_36}<br>The number of male and female members were not reported"
            },
            {
              type: "html",
              name: "total_number_of_farmers_age_summary",
              hideNumber: true,
              startWithNewLine: false,
              html:
                "<br><b>You have reported the age groups for {RO_farmers_age_total} total members,</b><br>Of which {RO_farmers_age_female_total} are female and {RO_farmers_age_male_total} are male"
            }
          ]
        },
        {
          type: "panel",
          name: "products_summary",
          title: "Products produced by your organization on Fairtrade terms",
          elements: [
            {
              type: "html",
              name: "products_produced_summary",
              hideNumber: true,
              html: "Test {major_product_category} test"
            }
          ]
        },
        {
          type: "checkbox",
          name: "confirm_report",
          titleLocation: "hidden",
          hideNumber: true,
          isRequired: true,
          choices: [
            {
              value: "confirm_correct",
              text:
                "I confirm that the information reported in this survey is correct to the best of my knowledge."
            }
          ]
        }
      ]
    }
  ],
  checkErrorsMode: "onValueChanged"
};

function App() {
  const survey = new Model(surveyJson);
  survey.focusFirstQuestionAutomatic = false;
  console.dir(survey);
  survey.onAfterRenderQuestion.add(onAfterRenderQuestion);
  survey.onDynamicPanelItemValueChanged.add(onDynamicPanelItemValueChanged);

  const alertResults = useCallback((sender) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  survey.onComplete.add(alertResults);

  return <Survey model={survey} />;
}

export default App;
