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
  title: "Self-reporting pilot test title",
  description: "This is where the short description of the survey would go",
  pages: [
    {
      navigationTitle: "Start page",
      name: "Start page",
      title: "Start Page",
      elements: [
        {
          type: "panel",
          name: "Number of farmers info box",
          elements: [
            {
              type: "html",
              name: "info_box_placeholder",
              hideNumber: true,
              html:
                "<br><b><u>PLACEHOLDER for information about survey, data points, consent to share, etc.:</u> Information like this will either go on each individual page, OR in an introduction/ consent to share info page.<hr>"
            },
            {
              type: "html",
              name: "info_box_memberspage",
              hideNumber: true,
              html:
                "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. <i>This helps Fairtrade communicate our reach and impact, analyze trends over time, make high-level decisions and guide our global strategy.</i>"
            },
            {
              type: "html",
              name: "info_box_memberspage_gender",
              hideNumber: true,
              html:
                "<br>A key element of this relates to representation of women in Fairtrade. <i>Information on the gender representation in your organization can help us understand how Fairtrade Standards contribute to preventing gender inequality, increasing female participation and empowering more women and girls to access the benefits of Fairtrade.</i><br>"
            }
          ]
        },
        {
          type: "panel",
          name: "startpage_panel",
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
              title: "[PRE-FILLED Placeholder] Choose your producer setup:",
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
              title:
                "[PRE-FILLED Placeholder] Choose the language of the survey:",
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
      ]
    },
    {
      name: "Members",
      title: "Members of your organization",
      navigationTitle: "Members",
      /*navigationDescription: "of your organization",*/
      visibleIf: "{producer_setup} = 'spo'",
      elements: [
        {
          type: "panel",
          name: "instructions_farmers",
          elements: [
            {
              type: "html",
              name: "info_box_numberfarmers",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the number of farmers that are members of your organization. Please also enter the number of women and men in your organization, if this information is known.<br><br><i>Count each member of your organization only once. If some members are in the process of transitioning from conventional to organic production, please count them as organic farmers.</i>"
            }
          ]
        },
        {
          type: "panel",
          name: "Number of farmers",
          elements: [
            {
              type: "panel",
              name: "farmers_conventional_panel",
              elements: [
                {
                  type: "html",
                  name: "info_box_conventional_farmers",
                  hideNumber: true,
                  html: "<br><b>Conventional Farmers</b>"
                },
                {
                  type: "text",
                  name: "farmers_conventional_total",
                  title: "Total farmers:",
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
                  title: "Farmers that are women:",
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
                  title: "Farmers that are men:",
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
                  type: "html",
                  name: "info_box_organic_farmers",
                  hideNumber: true,
                  html: "<br><b>Organic Farmers</b>"
                },
                {
                  type: "text",
                  name: "farmers_organic_total",
                  title: "Total farmers:",
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
                  title: "Farmers that are women:",
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
                  title: "Farmers that are men:",
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
          ]
        },
        {
          type: "text",
          name: "farmers_page_comments",
          title: "Optional space for comments:",
          hideNumber: true
        },
        {
          type: "panel",
          name: "summary_number_of_farmers",
          title: "Summary: number of members in your organization",
          visibleIf: "{organic_logic} = 'mixed'",
          elements: [
            {
              type: "expression",
              name: "farmers_total",
              title:
                "Total number of farmers that are members of your organization:",
              hideNumber: true,
              displayStyle: "decimal",
              expression: "{farmers_conventional_total}+{farmers_organic_total}"
            },
            {
              type: "expression",
              name: "farmers_female",
              title: "Number of farmers that are women:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{farmers_conventional_female}+{farmers_organic_female}"
            },
            {
              type: "expression",
              name: "farmers_male",
              startWithNewLine: false,
              title: "Number of farmers that are men:",
              hideNumber: true,
              displayStyle: "decimal",
              expression: "{farmers_conventional_male}+{farmers_organic_male}"
            }
          ]
        }
      ]
    },
    {
      name: "Young people (SPOs)",
      visibleIf: "{producer_setup} = 'spo'",
      title: "Number of young people as members of your organization",
      navigationTitle: "Young people",
      /*navigationDescription: "in your organization"*/
      elements: [
        {
          type: "panel",
          name: "instructions_farmers_by_age",
          elements: [
            {
              type: "html",
              name: "info_box_numberfarmers_byage",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the number of farmers that are members of your organization, according to the following age groups:<ul><li>16 to 28 years old</li><li>29 to 35 years old</li><li>36 years and older</li></ul><i>If exact numbers are not known, estimates or minimum amounts are ok, as long as the numbers entered here are not greater than the number of farmers entered on the previous page. Please also enter the number of women and men in each age group, if this information is known or can be reasonably estimated.</i>"
            }
          ]
        },
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
                "Please check here if you do not know the number of your organization's members for the specified age groups"
            }
          ]
        },
        {
          type: "panel",
          name: "Number of farmers by age",
          visibleIf: "{farmers_age_not_known} empty",
          elements: [
            {
              type: "panel",
              name: "panel_farmers_16_28",
              elements: [
                {
                  type: "html",
                  name: "info_box_farmers_16_28",
                  hideNumber: true,
                  html: "<br><b>Members 16 to 28 years old</b>"
                },
                {
                  type: "text",
                  name: "total_farmers_16_28",
                  title: "Total farmers:",
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
                  title: "Farmers that are women:",
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
                  title: "Farmers that are men:",
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
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of farmers age 16 to 28 years by gender"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "panel_farmers_29_35",
              elements: [
                {
                  type: "html",
                  name: "info_box_farmers_29_35",
                  hideNumber: true,
                  html: "<br><b>Members 29 to 35 years old</b>"
                },
                {
                  type: "text",
                  name: "total_farmers_29_35",
                  title: "Total farmers:",
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
                  title: "Farmers that are women:",
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
                  title: "Farmers that are men:",
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
                  titleLocation: "hidden",
                  hideNumber: true,
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of farmers age 29 to 35 years by gender"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "panel_farmers_36",
              elements: [
                {
                  type: "html",
                  name: "info_box_farmers_36",
                  hideNumber: true,
                  html: "<br><b>Members 36 years and older</b>"
                },
                {
                  type: "text",
                  name: "total_farmers_36",
                  title: "Total farmers:",
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
                  title: "Farmers that are women:",
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
                  title: "Farmers that are men:",
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
                  titleLocation: "hidden",
                  choices: [
                    {
                      value: "not_known",
                      text:
                        "Please check here if you do not know the number of farmers 36 years and older by gender"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "text",
          name: "farmers_age_page_comments",
          visibleIf: "{farmers_age_not_known} empty",
          title: "Optional space for comments:",
          hideNumber: true
        },
        {
          type: "panel",
          name: "Summary of farmers reported",
          title:
            "Summary: number of members in your organization reported by age group",
          visibleIf: "{farmers_age_not_known} empty",
          elements: [
            {
              type: "expression",
              name: "RO_farmers_age_total",
              title:
                "Total number of farmers reported that are members of your organization:",
              hideNumber: true,
              displayStyle: "decimal",
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
              title: "Number of farmers reported that are women:",
              hideNumber: true,
              displayStyle: "decimal",
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
              title: "Number of farmers reported that are men:",
              hideNumber: true,
              startWithNewLine: false,
              displayStyle: "decimal",
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
          ]
        }
      ]
    },
    {
      name: "Workers",
      title: "Number of workers employed by your organization",
      navigationTitle: "Workers",
      /*navigationDescription: "employed by your organization"*/
      elements: [
        {
          type: "panel",
          name: "Info box workers",
          elements: [
            {
              type: "html",
              name: "info_box_numberworkers",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the number of workers hired by your organization according to the following types of employment contract types: <b>permanent, fixed-term</b> and <b>sub-contracted</b>. Definitions for each contract type are provided in the corresponding section of the page. Please also enter the number of women and men your organization employs, if this information is known."
            },
            {
              type: "html",
              name: "info_box_spo_only",
              visibleIf: "{producer_setup} = 'spo'",
              hideNumber: true,
              html:
                "<br>This section applies <b>only to those workers hired by your organization directly.</b> Workers hired by individual members that work on farms should <i>not</i> be counted in this section."
            },
            {
              type: "html",
              name: "info_workerdefinition",
              hideNumber: true,
              html:
                "<br><i><b>Workers</b> are defined as all waged employees including migrant, temporary, seasonal, sub-contracted and permanent workers. Workers include all hired personnel whether they work in the field, in processing sites, or in administration. The term is restricted to personnel that can be unionised and therefore middle and senior and other professionals are generally not considered workers. For all types of workers, employment refers to any activity that one performs to produce goods or provide services for pay or profit.</i>"
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
              title: "Workers employed under a permanent contract",
              elements: [
                {
                  type: "html",
                  name: "info_box_permanent_worker",
                  hideNumber: true,
                  html:
                    "<br>A <b>permanent worker</b> is a worker that has an employment relationship with the company/organization for an indefinite period of time"
                },
                {
                  type: "text",
                  name: "workers_permanent_total",
                  title: "Total permanent workers:",
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
                        "{workers_permanent_total} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_permanent_female",
                  visibleIf: "{permanent_gender_not_known} empty",
                  title: "Permanent workers that are women:",
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
                        "{workers_permanent_total} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_permanent_male",
                  visibleIf: "{permanent_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Permanent workers that are men:",
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
                        "{workers_permanent_total} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_male} empty"
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
                        "Please check here if you do not know the number of women and men employed under a permanent contract"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "workers_fixedterm_panel",
              title: "Workers employed under a fixed-term contract",
              elements: [
                {
                  type: "html",
                  name: "info_box_fixedterm_worker",
                  hideNumber: true,
                  html:
                    "<br>A <b>fixed-term worker (or temporary)</b> worker is a worker that has an employment relationship with the company/organization that automatically ends or may be extended after a certain duration previously agreed with the employer"
                },
                {
                  type: "text",
                  name: "workers_fixed_term_total",
                  title: "Total fixed-term workers:",
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
                        "{workers_fixed_term_total} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_fixed_term_female",
                  visibleIf: "{workers_fixedterm_gender_not_known} empty",
                  title: "Fixed-term workers that are women:",
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
                        "{workers_fixed_term_total} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_fixed_term_male",
                  visibleIf: "{workers_fixedterm_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Fixed-term workers that are men:",
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
                        "{workers_fixed_term_total} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_male} empty"
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
                        "Please check here if you do not know the number of women and men employed under a fixed-term contract"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "workers_subcontractor_panel",
              title: "Sub-contracted workers employed by a third party",
              elements: [
                {
                  type: "html",
                  name: "info_box_subcontractor_worker",
                  hideNumber: true,
                  html:
                    "<br>A <b>sub-contracted worker</b> is a worker employed and paid by a third party, usually a labour broker, to provide labour to a third party in exchange for a fee that is collected by the broker"
                },
                {
                  type: "text",
                  name: "workers_subcontractor_total",
                  title: "Total sub-contracted workers:",
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
                        "{workers_subcontractor_total} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_subcontractor_female",
                  visibleIf: "{workers_subcontractor_gender_not_known} empty",
                  title: "Sub-contracted workers that are women:",
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
                        "{workers_subcontractor_total} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_female} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_subcontractor_male",
                  visibleIf: "{workers_subcontractor_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Sub-contracted workers that are men:",
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
                        "{workers_subcontractor_total} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_male} empty"
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
                        "Please check here if you do not know the number of women and men sub-contracted by a third party"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "text",
          name: "workers_page_comments",
          title: "Optional space for comments:",
          hideNumber: true
        },
        {
          type: "panel",
          name: "summary_number_of_workers",
          title: "Summary: number of workers in your organization",
          elements: [
            {
              type: "expression",
              name: "workers_total",
              title: "Total number of workers employed by your organization:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{workers_permanent_total}+{workers_fixed_term_total}+{workers_subcontractor_total}"
            },
            {
              type: "expression",
              name: "workers_female",
              title: "Number of workers that are women:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{workers_permanent_female}+{workers_fixed_term_female}+{workers_subcontractor_female}"
            },
            {
              type: "expression",
              name: "workers_male",
              startWithNewLine: false,
              title: "Number of workers that are men:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{workers_permanent_male}+{workers_fixed_term_male}+{workers_subcontractor_male}"
            },
            {
              type: "expression",
              name: "workers_seasonal_max_hidden",
              visible: false,
              title: "Max number of seasonal workers",
              displayStyle: "decimal",
              hideNumber: true,
              expression:
                "{workers_fixed_term_total}+{workers_subcontractor_total}"
            }
          ]
        }
      ]
    },
    {
      name: "Seasonal workers",
      title: "Seasonal workers hired by your organization",
      navigationTitle: "Seasonal workers",
      /*navigationDescription: "employed by your organization"*/
      elements: [
        {
          type: "panel",
          name: "Info box seasonal workers",
          elements: [
            {
              type: "html",
              name: "info_box_seasonalworkers",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the number of fixed-term and sub-contracted workers hired by your organization that are also seasonal workers. A <b>seasonal worker</b> is a worker that provides labour during certain seasons, usually during harvesting. Seasonal workers may be directly employed (usually as a fixed-term worker) or sub-contracted. Please also enter the number of seasonal women and men your organization employs, if this information is known."
            },
            {
              type: "html",
              name: "info_box_spo_only",
              visibleIf: "{producer_setup} = 'spo'",
              hideNumber: true,
              html:
                "<br>This section applies <b>only to those workers hired by your organization directly.</b> Workers hired by individual members that work on farms should <i>not</i> be counted in this section."
            },
            {
              type: "html",
              name: "info_workerdefinition",
              hideNumber: true,
              html:
                "<br><i><b>Workers</b> are defined as all waged employees including migrant, temporary, seasonal, sub-contracted and permanent workers. Workers include all hired personnel whether they work in the field, in processing sites, or in administration. The term is restricted to personnel that can be unionised and therefore middle and senior and other professionals are generally not considered workers. For all types of workers, employment refers to any activity that one performs to produce goods or provide services for pay or profit.</i>"
            }
          ]
        },
        {
          type: "panel",
          name: "workers_seasonal_panel",
          title: "Seasonal workers employed by your organization",
          elements: [
            {
              type: "html",
              name: "workers_seasonal_max_html",
              hideNumber: true,
              html:
                "<br>You entered that your organization employs <b>{workers_seasonal_max_hidden}</b> fixed-term and sub-contracted workers. Of these how many are seasonally employed?"
            },
            {
              type: "text",
              name: "workers_seasonal_total",
              title: "Total seasonal workers:",
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
              title: "Seasonal workers that are women:",
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
              title: "Seasonal workers that are men:",
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
          ]
        },
        {
          type: "text",
          name: "seasonal_workers_page_comments",
          title: "Optional space for comments:",
          hideNumber: true
        }
      ]
    },
    {
      name: "Young people (HL)",
      visibleIf: "{producer_setup} = 'hlo'",
      title: "Number of young people employed by your organization",
      navigationTitle: "Young people",
      /*navigationDescription: "employed by your organization"*/
      elements: [
        {
          type: "panel",
          name: "instructions_workers_by_age",
          elements: [
            {
              type: "html",
              name: "info_box_numberworkers_byage",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the number of workers employed by your organization, according to the following age groups:<ul><li>16 to 28 years old</li><li>29 to 35 years old</li><li>36 years and older</li></ul><i>If exact numbers are not known, estimates or minimum amounts are ok, as long as the numbers entered here are not greater than the number of workers entered on the previous page. Please also enter the number of women and men in each age group, if this information is known or can be reasonably estimated.</i>"
            }
          ]
        },
        {
          type: "checkbox",
          name: "workers_age_not_known",
          title:
            "Do you know the number of workers hired by your organization by age groups?",
          titleLocation: "hidden",
          hideNumber: true,
          choices: [
            {
              value: "not_known",
              text:
                "Please check here if you do not know the number of workers employed by your organization for the specified age groups"
            }
          ]
        },
        {
          type: "panel",
          name: "Number of workers by age",
          visibleIf: "{workers_age_not_known} empty",
          elements: [
            {
              type: "panel",
              name: "panel_workers_16_28",
              elements: [
                {
                  type: "html",
                  name: "info_box_workers_16_28",
                  hideNumber: true,
                  html: "<br><b>Workers 16 to 28 years old</b>"
                },
                {
                  type: "text",
                  name: "total_workers_16_28",
                  title: "Total workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                  title: "Workers that are women:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                  title: "Workers that are men:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                        "Please check here if you do not know the number of workers age 16 to 28 years by gender"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "panel_workers_29_35",
              elements: [
                {
                  type: "html",
                  name: "info_box_workers_29_35",
                  hideNumber: true,
                  html: "<br><b>Workers 29 to 35 years old</b>"
                },
                {
                  type: "text",
                  name: "total_workers_29_35",
                  title: "Total workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                  title: "Workers that are women:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                  title: "Workers that are men:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                        "Please check here if you do not know the number of workers age 29 to 35 years by gender"
                    }
                  ]
                }
              ]
            },
            {
              type: "panel",
              name: "panel_workers_36",
              elements: [
                {
                  type: "html",
                  name: "info_box_workers_36",
                  hideNumber: true,
                  html: "<br><b>Workers 36 years and older</b>"
                },
                {
                  type: "text",
                  name: "total_workers_36",
                  title: "Total workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                  title: "Workers that are women:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                  title: "Workers that are men:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                    {
                      type: "expression",
                      text:
                        "Totals do not add up. Please check that the total number of female and male workers is correct. If not, please adjust the numbers you recorded.",
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
                        "Please check here if you do not know the number of workers 36 years and older by gender"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "text",
          name: "workers_age_page_comments",
          visibleIf: "{workers_age_not_known} empty",
          title: "Optional space for comments:",
          hideNumber: true
        },
        {
          type: "panel",
          name: "Summary of workers reported",
          title:
            "Summary number of workers employed by your organization reported by age group",
          visibleIf: "{workers_age_not_known} empty",
          elements: [
            {
              type: "expression",
              name: "RO_workers_age_total",
              title:
                "Total number of workers reported that are employed by your organization:",
              hideNumber: true,
              displayStyle: "decimal",
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
              title: "Number of workers reported that are women:",
              hideNumber: true,
              displayStyle: "decimal",
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
              title: "Number of workers reported that are men:",
              hideNumber: true,
              startWithNewLine: false,
              displayStyle: "decimal",
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
          ]
        }
      ]
    },
    {
      name: "Total Land Area",
      title: "Land area under cultivation by your organization",
      elements: [
        {
          type: "panel",
          name: "instructions_landarea",
          elements: [
            {
              type: "html",
              name: "info_box_landarea",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the land area managed by your organization."
            },
            {
              type: "html",
              name: "info_box_totalarea_SPO",
              visibleIf: "{producer_setup} = 'spo'",
              hideNumber: true,
              html:
                "<br><i>The <b>Total land area managed</b> refers to all land area managed by members of your organization and under agricultural cultivation, whether Fairtrade certified or not.</i>"
            },
            {
              type: "html",
              name: "info_box_fairtrade_area",
              hideNumber: true,
              html:
                "<br><i>The <b>Fairtrade certified land area</b> refers to only the area of land within your organization that is under cultivation of Fairtrade certified crops.</i>"
            }
          ]
        },
        {
          type: "panel",
          name: "land_area_panel",
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
              type: "text",
              name: "total_land_managed",
              hideNumber: true,
              title: "Total land area managed (in {land_area_unit}):",
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
              startWithNewLine: false,
              title: "Fairtrade certified land area (in {land_area_unit}):",
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
        },
        {
          type: "text",
          name: "landarea_page_comments",
          title: "Optional space for comments:",
          hideNumber: true
        }
      ]
    },
    {
      name: "product_page",
      navigationTitle: "Products",
      title: "Products produced by your organization on Fairtrade terms",
      elements: [
        {
          type: "panel",
          name: "instructions_products_page",
          elements: [
            {
              type: "html",
              name: "info_box_products_page",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the land area under cultivation and volumes produced in the most recent production cycle (2021-2022) by your organization for each Fairtrade certified product. If your organization also has a forecast of the volume that will be of export quality for sale on Fairtrade terms for the upcoming production cycle (2022-2023), please also enter this information."
            },
            {
              type: "html",
              name: "info_box_units",
              hideNumber: true,
              html:
                "<br>Note that <u>some units should only be used for specific products</u>. For guidance on which units to use for your organization's products, please see the information box at the bottom of this page."
            },
            {
              type: "html",
              name: "info_box_navigation",
              hideNumber: true,
              html:
                "<br>How to enter information about your organization's Fairtrade certified products:<i><ul><li>Select 'Add product.' From the dropdown list, select the product and proceed to enter the land area, volumes produced, and forecast volumes.</li><li>To add a second product, scroll to the bottom of the page and select 'Add product.' You can add as many Fairtrade products as needed.</li><li>Go back to the previous or next product by using the navigation buttons at the botom of the page.</li><li>To remove all information about a product, select 'Remove this product' at the bottom of the page.</li></ul></i>"
            }
          ]
        },
        {
          type: "paneldynamic",
          name: "products_panel",
          title: "Fairtrade products",
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
                "Please select the type of {panel.major_product_category} from the dropdown that your organization produced under Fairtrade certification",
              visibleIf: "{panel.major_product_category} notempty",
              hideNumber: true,
              isRequired: true,
              choices: ["item1", "item2"]
            },
            {
              type: "text",
              name: "minor_category_other",
              hideNumber: true,
              title:
                "If your product was not listed and you selected 'Other' please specify here the product for which your organization produced under Fairtrade certification:",
              visibleIf: "{panel.minor_product_category} contains 'Other'"
            },
            {
              type: "panel",
              name: "land_area_panel",
              visibleIf: "{panel.minor_product_category} notempty",
              title:
                "Land area under Fairtrade cultivation: {panel.major_product_category} ({panel.minor_product_category})",
              elements: [
                {
                  type: "html",
                  name: "honey_land_area_html",
                  hideNUmber: true,
                  visibleIf: "{panel.major_product_category} = 'Honey'",
                  html:
                    "<br><i>For honey, please enter the <b>number of beehives</b> instead of {land_area_unit} of land</i>"
                },
                {
                  type: "text",
                  name: "land_total_production",
                  visibleIf: "{panel.land_area_known} empty",
                  hideNumber: true,
                  title:
                    "How many total {land_area_unit} of land was cultivated with {panel.minor_product_category}?",
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
              ]
            },
            {
              type: "panel",
              name: "panel_volumes_produced",
              visibleIf: "{panel.minor_product_category} notempty",
              title:
                "Volumes Produced on Fairtrade terms in the 2021-2022 production cycle: {panel.major_product_category} ({panel.minor_product_category})",
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
                  name: "product_form_other",
                  hideNumber: true,
                  title:
                    "If your product was not listed and you selected 'Other' please specify here the product form for which you are reporting production:",
                  visibleIf: "{panel.minor_product_category} contains 'Other'"
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
                  title:
                    "Is the reported volume produced the actual amount or estimated?",
                  hideNumber: true,
                  defaultValue: "true",
                  labelTrue: "Estimates",
                  labelFalse: "Actual"
                },
                {
                  type: "dropdown",
                  name: "volume_produced_estimated_how",
                  title:
                    "What measure did you use to estimate the volume produced?",
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
              ]
            },
            {
              type: "panel",
              name: "summary_production_yields",
              visibleIf: "{panel.minor_product_category} notempty",
              title:
                "Summary of production and yields for the 2021-2022 production cycle: {panel.major_product_category} ({panel.minor_product_category})",
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
              ]
            },
            {
              type: "panel",
              name: "panel_volumes_forecast",
              visibleIf: "{panel.minor_product_category} notempty",
              title:
                "Forecast of volumes of export quality for the 2022-2023 production cycle: {panel.major_product_category} ({panel.minor_product_category})",
              elements: [
                {
                  type: "dropdown",
                  name: "volume_forecast_unit",
                  hideNumber: true,
                  isRequired: true,
                  startWithNewLine: false,
                  title:
                    "In what unit would you like to report your organization's {panel.minor_product_category} forecasted volume?",
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
              ]
            },
            {
              type: "text",
              name: "product_page_comments_byproduct",
              title: "Optional space for comments:",
              visibleIf: "{panel.minor_product_category} notempty",
              hideNumber: true
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
          title: "Information box: Units for reporting volumes produced",
          elements: [
            {
              type: "html",
              name: "kg_description",
              hideNumber: true,
              html:
                "<hr><b>Kilograms (kg):</b> Use kg when you know the volume of your product in kilograms."
            },
            {
              type: "html",
              name: "mt_description",
              startWithNewLine: false,
              hideNumber: true,
              html:
                "<hr><b>Metric tons (MT):</b> Use MT when you know the volume of your product in metric tons."
            },
            {
              type: "html",
              name: "boxes_large_description",
              hideNumber: true,
              html:
                "<hr><b>18.14 kg Boxes:</b> For bananas only. use 18.14 kg Boxes when you know the number of boxes of bananas."
            },
            {
              type: "html",
              name: "boxes_small_description",
              startWithNewLine: false,
              hideNumber: true,
              html:
                "<hr><b>13.5 kg Boxes:</b> For bananas only. use 13.5 kg Boxes when you know the number of boxes of bananas."
            },
            {
              type: "html",
              name: "pounds_description",
              hideNumber: true,
              html:
                "<hr><b>Pound:</b> Use pound when you know the volume of your product in pounds."
            },
            {
              type: "html",
              name: "quintales_description",
              startWithNewLine: false,
              hideNumber: true,
              html:
                "<hr><b>Quintales (46 kg):</b> Use quintales when you know the volume of your product in quintales (1 quintale = 46 kg)."
            },
            {
              type: "html",
              name: "flowers_description",
              hideNumber: true,
              html:
                "<hr><b>Stems of flowers:</b> For flowers and plants only. use when you know the number of flowers or plants."
            },
            {
              type: "html",
              name: "1000stems_description",
              startWithNewLine: false,
              hideNumber: true,
              html:
                "<hr><b>1000 stems of flowers:</b> For flowers and plants only. use when you know the number of 1,000 flower or plant bunches."
            },
            {
              type: "html",
              name: "litres_description",
              hideNumber: true,
              html:
                "<hr><b>Litres:</b> For argan oil and wine bottles only. use litres when you know the volume of your oil or wine in litres."
            },
            {
              type: "html",
              name: "items_description",
              startWithNewLine: false,
              hideNumber: true,
              html:
                "<hr><b>Items:</b> For coconuts and sportsballs only. use items when you know the number of coconuts or sportsballs produced."
            }
          ]
        }
      ]
    },
    {
      navigationTitle: "Summary",
      name: "Summary report",
      title: "Summary report (PLACEHOLDER - SPO only)",
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
