import { useCallback } from "react";

import "survey-core/defaultV2.min.css";
// import 'survey-core/survey.min.css';
import { StylesManager, Model, FunctionFactory } from "survey-core";
import { Survey } from "survey-react-ui";
import ProductTree from "./ProductTree";

StylesManager.applyTheme("defaultV2");

FunctionFactory.Instance.register("screenValue", screenValue);

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
      options.panel.getQuestionByName("minor_product_category").value = null;
      break;
    case "minor_product_category":
      ProductTree.filterProductionTypes(
        options.panel.getQuestionByName("product_form_name"),
        options.value,
        options.panel.getQuestionByName("major_product_category").value
      );
      options.panel.getQuestionByName("product_form_name").value = null;
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
  title: "FairInsight Self-Reporting & Usage Pilot Survey",
  description: "This is where the short description of the survey would go",
  showPreviewBeforeComplete: "showAnsweredQuestions",
  pages: [
    {
      navigationTitle: "Start page",
      name: "Start page",
      title: "Welcome to the Survey on [FairInsight usage pilot]!",
      elements: [
        {
          type: "panel",
          name: "hidden_fields_panel",
          title: "This panel will be pre-populated and hidden",
          /*visible: false,*/
          elements: [
            {
              type: "text",
              name: "floid",
              title: "Fairtrade ID (FLOID):",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                }
              ]
            },
            {
              type: "text",
              name: "org_name",
              title:
                "Name of the organization:"
            },
            {
              type: "radiogroup",
              name: "producer_setup",
              title: "Choose your producer setup:",
              choices: [
                {
                  value: "spo",
                  text:
                    "Small-scale producer organization or Contract production"
                },
                {
                  value: "hl",
                  text: "Hired labor plantation"
                }
              ]
            },
            {
              type: "radiogroup",
              name: "survey_language",
              title:
                "Choose the language of the survey:",
              choices: [
                {
                  value: "en",
                  text: "English"
                },
                {
                  value: "es",
                  text: "Spanish"
                },
                {
                  value: "pt",
                  text: "Portuguese"
                },
                {
                  value: "fr",
                  text: "French"
                }
              ],
              defaultValue: "en"
            }
          ]
        },
        {
          type: "panel",
          name: "consent_form_text",
          elements: [
            {
              type: "html",
              name: "info_box_placeholder",
              hideNumber: true,
              html:
                "<br>Fairtrade is a voluntary certification system which aims to have positive impacts on farmers like you through the certification of your certified product.<br><br>Our goal is to make FairInsight a single place for producer organizations to share your information with Fairtrade. Over the next few years, FairInsight will replace other data collection tools (such as the CODImpact questionnaire conducted during audits).<br><br>Through this questionnaire Fairtrade is collecting data from members of certified organizations to better understand any challenges in reporting and the quality of data being reported. Your participation is very important for the survey’s success. Your contribution will be identifiable to us so that we can follow up on untangling specific issues or challenges that you may face while reporting.<br><br>While the survey is completely voluntary, your participation will help us better understand how to make the FairInsight platform easy to use and beneficial to you. The collected data will be treated as confidential by the Fairtrade system and we would only be using this for internal quality assessments that may inform the further development of FairInsight. No personal or sensitive information will be shared outside of Fairtrade International and the Producer Networks."
            },
            {
              type: "radiogroup",
              name: "consent_to_participate",
              title: "Are you willing to take part in this survey for internal learning and improvement?",
              isRequired: true,
              hideNumber: true,
              choices: [
                {
                  value: "consent",
                  text: "Yes, I consent to sharing my information and feedback asked in this survey with Fairtrade"
                },
                {
                  value: "no_consent",
                  text: "No, I do not consent to sharing my information and feedback asked in this survey with Fairtrade"
                }
              ],
              defaultValue: 'consent'
            }
          ]
        },
        {
          type: "panel",
          name: "organic_logic_panel",
          visibleIf: "{consent_to_participate} = 'consent'",
          elements: [
            {
              type: "html",
              name: "info_box_in_transition_to_organic",
              hideNumber: true,
              html: "<br><i>Note: For the purposes of this survey, please consider members, land area and production that are in transition from conventional to organic, as organic</i>"
            },
            {
              type: "radiogroup",
              name: "organic_logic",
              title:
                "For the last production cycle (2021-2022), was some or all of your production of Fairtrade crops also produced under, or in transition to, an organic certification?",
              isRequired: true,
              hideNumber: true,
              choices: [
                {
                  value: "mixed",
                  text:
                    "Yes, some production was organic and some was conventional"
                },
                {
                  value: "organic_only",
                  text: "Yes, all production was organic or in transition to organic"
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
      visibleIf: "{producer_setup} = 'spo' AND {consent_to_participate} = 'consent'",
      elements: [
        {
          type: "panel",
          name: "instructions_farmers",
          elements: [
            {
              type: "html",
              name: "info_box_farmers_workers",
              hideNumber: true,
              html: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. This helps Fairtrade understand and communicate our reach, analyse trends over time, and guide our global strategy."
            },
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
              title: "Conventional Farmers",
              elements: [
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
                        "The sum of male and female conventional farmers is greater than the total. Please correct the error.",
                      expression:
                        "{farmers_conventional_total} >= {farmers_conventional_female}+{farmers_conventional_male} OR {farmers_conventional_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_conventional_female",
                  visibleIf: "{farmers_conventional_gender_not_known} empty",
                  title: "Number of female farmers:",
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
                  name: "farmers_conventional_male",
                  visibleIf: "{farmers_conventional_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Number of male farmers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_conventional_farmers_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female conventional farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{farmers_conventional_total} > {farmers_conventional_female}+{farmers_conventional_male} AND {farmers_conventional_female} notempty AND {farmers_conventional_male} notempty"
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
              title: "Organic Farmers",
              elements: [
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
                        "The sum of male and female organic farmers is greater than the total. Please correct the error.",
                      expression:
                        "{farmers_organic_total} >= {farmers_organic_female}+{farmers_organic_male} OR {farmers_organic_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_organic_female",
                  visibleIf: "{farmers_organic_gender_not_known} empty",
                  title: "Number of female farmers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                  ]
                },
                {
                  type: "text",
                  name: "farmers_organic_male",
                  visibleIf: "{farmers_organic_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Number of male farmers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    },
                  ]
                },
                {
                  type: "html",
                  name: "warning_organic_farmers_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female organic farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{farmers_organic_total} > {farmers_organic_female}+{farmers_organic_male} AND {farmers_organic_female} notempty AND {farmers_organic_male} notempty"
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
              title: "Number of female farmers:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{farmers_conventional_female}+{farmers_organic_female}"
            },
            {
              type: "expression",
              name: "farmers_male",
              startWithNewLine: false,
              title: "Number of male farmers:",
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
      visibleIf: "{producer_setup} = 'spo' AND {consent_to_participate} = 'consent'",
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
              name: "info_box_farmers_workers",
              hideNumber: true,
              html: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. We are also trying to better understand the engagement of young people in Fairtrade organizations."
            },
            {
              type: "html",
              name: "info_box_numberfarmers_byage",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the number of farmers that are members of your organization, according to the following age groups:<ul><li>16 to 28 years old</li><li>29 to 35 years old</li><li>36 years and older</li></ul>If you know the number of members for some age groups but not all, please fill in the fields that you know and leave the rest blank. If you do not know this information for any and all of the age groups, please check the box below and proceed to the next page.<br><br><i>If exact numbers are not known, estimates or minimum amounts are ok, as long as the numbers entered here are not greater than the number of farmers entered on the previous page. Please also enter the number of women and men in each age group, if this information is known or can be reasonably estimated.</i>"
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
                "Please check here if you do not know the number of your organization's members for any of the specified age groups."
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
                        "The sum of male and female farmers is greater than the total. Please correct the error.",
                      expression:
                        "{total_farmers_16_28} >= {farmers_female_16_28}+{farmers_male_16_28} OR {total_farmers_16_28} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error.",
                      expression:
                        "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_16_28} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_female_16_28",
                  visibleIf: "{farmers_gender_not_known_16_28} empty",
                  title: "Number of female farmers:",
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
                  name: "farmers_male_16_28",
                  visibleIf: "{farmers_gender_not_known_16_28} empty",
                  startWithNewLine: false,
                  title: "Number of male farmers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_farmers_16to28_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{total_farmers_16_28} > {farmers_female_16_28}+{farmers_male_16_28} AND {farmers_female_16_28} notempty AND {farmers_male_16_28} notempty"
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
                        "The sum of male and female farmers is greater than the total. Please correct the error.",
                      expression:
                        "{total_farmers_29_35} >= {farmers_female_29_35}+{farmers_male_29_35} OR {total_farmers_29_35} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error.",
                      expression:
                        "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_29_35} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_female_29_35",
                  visibleIf: "{farmers_gender_not_known_29_35} empty",
                  title: "Number of female farmers:",
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
                  name: "farmers_male_29_35",
                  visibleIf: "{farmers_gender_not_known_29_35} empty",
                  startWithNewLine: false,
                  title: "Number of male farmers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_farmers_29to35_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{total_farmers_29_35} > {farmers_female_29_35}+{farmers_male_29_35} AND {farmers_female_29_35} notempty AND {farmers_male_29_35} notempty"
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
                        "The sum of male and female farmers is greater than the total. Please correct the error.",
                      expression:
                        "{total_farmers_36} >= {farmers_female_36}+{farmers_male_36} OR {total_farmers_36} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error.",
                      expression:
                        "{RO_farmers_age_total} <= {farmers_total} OR {total_farmers_36} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "farmers_female_36",
                  visibleIf: "{farmers_gender_not_known_36} empty",
                  title: "Number of female farmers:",
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
                  name: "farmers_male_36",
                  visibleIf: "{farmers_gender_not_known_36} empty",
                  startWithNewLine: false,
                  title: "Number of male farmers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_farmers_36_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female farmers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{total_farmers_36} > {farmers_female_36}+{farmers_male_36} AND {farmers_female_36} notempty AND {farmers_male_36} notempty"
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
              type: "panel",
              name: "farmers_total_summary_byage",
              title: "Total number of farmers in your organization: {farmers_total}",
              elements: [
            {
              type: "expression",
              name: "RO_farmers_age_total",
              title:
                "Number of farmers reported in an age group:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{total_farmers_16_28}+{total_farmers_29_35}+{total_farmers_36}"
            },
            {
              type: "expression",
              name: "RO_farmers_age_unknown",
              title:
                "Number of farmers (age unknown):",
              hideNumber: true,
              displayStyle: "decimal",
              startWithNewLine: false,
              expression:
                "{farmers_total}-{RO_farmers_age_total}"
            },
            {
              type: "html",
              name: "warning_farmers_byage_sum",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of farmers by age group is less than the total reported on the previous page. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
              visibleIf: "{farmers_total} > {RO_farmers_age_total}"
            },
            {
              type: "html",
              name: "warning_farmers_total_byage",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of farmers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>',
              visibleIf: "{RO_farmers_age_total} > {farmers_total}"
            }
          ]
        },
        {
          type: "panel",
          name: "farmers_female_summary_byage",
          title: "Total number of female farmers in your organization: {farmers_female}",
          elements: [
            {
              type: "expression",
              name: "RO_farmers_age_female_total",
              title: "Number of female farmers reported in an age group:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{farmers_female_16_28}+{farmers_female_29_35}+{farmers_female_36}"
            },
            {
              type: "expression",
              name: "RO_farmers_age_female_unknown",
              title: "Number of female farmers (age unknown):",
              hideNumber: true,
              displayStyle: "decimal",
              startWithNewLine: false,
              expression:
                "{farmers_female}-{RO_farmers_age_female_total}"
            },
            {
              type: "html",
              name: "warning_farmers_female_byage",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of female farmers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>',
              visibleIf: "{RO_farmers_age_female_total} > {farmers_female}"
            }
          ]
        },
        {
          type: "panel",
          name: "farmers_male_summary_byage",
          title: "Total number of male farmers in your organization: {farmers_male}",
          elements: [
            {
              type: "expression",
              name: "RO_farmers_age_male_total",
              title: "Number of male farmers reported in an age group:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{farmers_male_16_28}+{farmers_male_29_35}+{farmers_male_36}"
            },
            {
              type: "expression",
              name: "RO_farmers_age_male_unknown",
              title: "Number of male farmers (age unknown):",
              hideNumber: true,
              startWithNewLine: false,
              displayStyle: "decimal",
              expression:
                "{farmers_male}-{RO_farmers_age_male_total}"
            },
            {
              type: "html",
              name: "warning_farmers_male_byage",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male farmers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>',
              visibleIf: "{RO_farmers_age_male_total} > {farmers_male}"
            }
          ]
        }
          ]
        }
      ]
    },
    {
      name: "Workers",
      title: "Number of workers employed by your organization",
      navigationTitle: "Workers",
      visibleIf: "{consent_to_participate} = 'consent'",
      /*navigationDescription: "employed by your organization"*/
      elements: [
        {
          type: "panel",
          name: "Info box workers",
          elements: [
            {
              type: "html",
              name: "info_box_farmers_workers",
              hideNumber: true,
              html: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. This helps Fairtrade understand and communicate our reach, analyse trends over time, and guide our global strategy."
            },
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
                        "The sum of male and female permanent workers is greater than the total. Please correct the error.",
                      expression:
                        "{workers_permanent_total} >= {workers_permanent_female}+{workers_permanent_male} OR {workers_permanent_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_permanent_female",
                  visibleIf: "{permanent_gender_not_known} empty",
                  title: "Number of female permanent workers:",
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
                  visibleIf: "{permanent_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Number of male permanent workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_permanent_workers_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female permanent workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{workers_permanent_total} > {workers_permanent_female}+{workers_permanent_male} AND {workers_permanent_female} notempty AND {workers_permanent_male} notempty"
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
                        "The sum of male and female fixed-term workers is greater than the total. Please correct the error.",
                      expression:
                        "{workers_fixed_term_total} >= {workers_fixed_term_female}+{workers_fixed_term_male} OR {workers_fixed_term_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_fixed_term_female",
                  visibleIf: "{workers_fixedterm_gender_not_known} empty",
                  title: "Number of female fixed-term workers:",
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
                  visibleIf: "{workers_fixedterm_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Number of male fixed-term workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_fixed_term_workers_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female fixed-term workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{workers_fixed_term_total} > {workers_fixed_term_female}+{workers_fixed_term_male} AND {workers_fixed_term_female} notempty AND {workers_fixed_term_male} notempty"
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
                        "The sum of male and female sub-contracted workers is greater than the total. Please correct the error.",
                      expression:
                        "{workers_subcontractor_total} >= {workers_subcontractor_female}+{workers_subcontractor_male} OR {workers_subcontractor_total} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_subcontractor_female",
                  visibleIf: "{workers_subcontractor_gender_not_known} empty",
                  title: "Number of female sub-contracted workers:",
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
                  visibleIf: "{workers_subcontractor_gender_not_known} empty",
                  startWithNewLine: false,
                  title: "Number of male sub-contracted workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_subcontractor_workers_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female subcontracted workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{workers_subcontractor_total} > {workers_subcontractor_female}+{workers_subcontractor_male} AND {workers_subcontractor_female} notempty AND {workers_subcontractor_male} notempty"
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
              title: "Number of female workers:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{workers_permanent_female}+{workers_fixed_term_female}+{workers_subcontractor_female}"
            },
            {
              type: "expression",
              name: "workers_male",
              startWithNewLine: false,
              title: "Number of male workers:",
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
        },
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
                    "The sum of male and female seasonal workers is greater than the total. Please correct the error.",
                  expression:
                    "{workers_seasonal_total} >= {workers_seasonal_female}+{workers_seasonal_male} OR {workers_seasonal_total} empty"
                },
                {
                  type: "expression",
                  text: "The number of seasonal workers reported is greater than the number of fixed-term and sub-contracted workers. Please correct the error.",
                  expression: "{workers_seasonal_total} <= {workers_fixed_term_total}+{workers_subcontractor_total} OR {workers_seasonal_total} empty"
                }
              ]
            },
            {
              type: "text",
              name: "workers_seasonal_female",
              visibleIf: "{workers_seasonal_gender_not_known} empty",
              title: "Number of female seasonal workers:",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                },
                {
                  type: "expression",
                  text: "The number of seasonal female workers reported is greater than the number of fixed-term and sub-contracted female workers. Please correct the error.",
                  expression: "{workers_seasonal_female} <= {workers_fixed_term_female}+{workers_subcontractor_female} OR {workers_seasonal_female} empty"
                }
              ]
            },
            {
              type: "text",
              name: "workers_seasonal_male",
              visibleIf: "{workers_seasonal_gender_not_known} empty",
              startWithNewLine: false,
              title: "Number of male seasonal workers:",
              hideNumber: true,
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a valid number"
                },
                {
                  type: "expression",
                  text: "The number of seasonal male workers reported is greater than the number of fixed-term and sub-contracted male workers. Please correct the error.",
                  expression: "{workers_seasonal_male} <= {workers_fixed_term_male}+{workers_subcontractor_male} OR {workers_seasonal_male} empty"
                }
              ]
            },
            {
              type: "html",
              name: "warning_fixed_seasonal_sum",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female seasonal workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
              visibleIf: "{workers_seasonal_total} > {workers_seasonal_female}+{workers_seasonal_male} AND {workers_seasonal_female} notempty AND {workers_seasonal_male} notempty"
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
      visibleIf: "{producer_setup} = 'hl' AND {consent_to_participate} = 'consent'",
      title: "Number of young people employed by your organization",
      navigationTitle: "Young people",
      elements: [
        {
          type: "panel",
          name: "instructions_workers_by_age",
          elements: [
            {
              type: "html",
              name: "info_box_youth",
              hideNumber: true,
              html: "<br>One of the most important pieces of information that Fairtrade stakeholders and consumers are interested in is how many male and female farmers and workers are part of the global Fairtrade community and benefit from Fairtrade certification. We are also trying to better understand the engagement of young people in Fairtrade organizations."
            },
            {
              type: "html",
              name: "info_box_numberworkers_byage",
              hideNumber: true,
              html:
                "<br><b>Instructions:</b><hr>In this section, please enter the number of workers employed by your organization, according to the following age groups:<ul><li>16 to 28 years old</li><li>29 to 35 years old</li><li>36 years and older</li></ul>If you know the number of workers for some age groups but not all, please fill in the fields that you know and leave the rest blank. If you do not know this information for any and all of the age groups, please check the box below and proceed to the next page.<br><br><i>If exact numbers are not known, estimates or minimum amounts are ok, as long as the numbers entered here are not greater than the number of workers entered on the previous page. Please also enter the number of women and men in each age group, if this information is known or can be reasonably estimated.</i>"
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
                "Please check here if you do not know the number of workers employed by your organization for any of the specified age groups"
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
                        "The sum of male and female workers is greater than the total. Please correct the error.",
                      expression:
                        "{total_workers_16_28} >= {workers_female_16_28}+{workers_male_16_28} OR {total_workers_16_28} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The sum of workers by age group is greater than the total reported on the previous page. Please correct the error.",
                      expression:
                        "{RO_workers_age_total} <= {workers_total} OR {total_workers_16_28} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_female_16_28",
                  visibleIf: "{workers_gender_not_known_16_28} empty",
                  title: "Number of female workers:",
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
                  name: "workers_male_16_28",
                  visibleIf: "{workers_gender_not_known_16_28} empty",
                  startWithNewLine: false,
                  title: "Number of male workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_workers_16to28_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{total_workers_16_28} > {workers_female_16_28}+{workers_male_16_28} AND {workers_female_16_28} notempty AND {workers_male_16_28} notempty"
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
                        "The sum of male and female workers is greater than the total. Please correct the error.",
                      expression:
                        "{total_workers_29_35} >= {workers_female_29_35}+{workers_male_29_35} OR {total_workers_29_35} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The sum of workers by age group is greater than the total reported on the previous page. Please correct the error.",
                      expression:
                        "{RO_workers_age_total} <= {workers_total} OR {total_workers_29_35} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_female_29_35",
                  visibleIf: "{workers_gender_not_known_29_35} empty",
                  title: "Number of female workers:",
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
                  name: "workers_male_29_35",
                  visibleIf: "{workers_gender_not_known_29_35} empty",
                  startWithNewLine: false,
                  title: "Number of male workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_workers_29to35_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{total_workers_29_35} > {workers_female_29_35}+{workers_male_29_35} AND {workers_female_29_35} notempty AND {workers_male_29_35} notempty"
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
                        "The sum of male and female workers is greater than the total. Please correct the error.",
                      expression:
                        "{total_workers_36} >= {workers_female_36}+{workers_male_36} OR {total_workers_36} empty"
                    },
                    {
                      type: "expression",
                      text:
                        "The sum of workers by age group is greater than the total reported on the previous page. Please correct the error.",
                      expression:
                        "{RO_workers_age_total} <= {workers_total} OR {total_workers_36} empty"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "workers_female_36",
                  visibleIf: "{workers_gender_not_known_36} empty",
                  title: "Number of female workers:",
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
                  name: "workers_male_36",
                  visibleIf: "{workers_gender_not_known_36} empty",
                  startWithNewLine: false,
                  title: "Number of male workers:",
                  hideNumber: true,
                  validators: [
                    {
                      type: "numeric",
                      text: "Please enter a valid number"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_workers_36_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male and female workers is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{total_workers_36} > {workers_female_36}+{workers_male_36} AND {workers_female_36} notempty AND {workers_male_36} notempty"
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
            "Summary number of workers reported by age group",
          visibleIf: "{workers_age_not_known} empty",
          elements: [
            {
              type: "panel",
              name: "workers_total_summary_byage",
              title: "Total number of workers employed by your organization: {workers_total}",
              elements: [
            {
              type: "expression",
              name: "RO_workers_age_total",
              title:
                "Number of workers reported in an age group:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{total_workers_16_28}+{total_workers_29_35}+{total_workers_36}"
            },
            {
              type: "expression",
              name: "RO_workers_age_unknown",
              title:
                "Number of workers (age unknown):",
              hideNumber: true,
              displayStyle: "decimal",
              startWithNewLine: false,
              expression:
                "{workers_total}-{RO_workers_age_total}"
            },
            {
              type: "html",
              name: "warning_workers_byage_sum",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of workers by age group is less than the total reported on the previous page. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
              visibleIf: "{workers_total} > {RO_workers_age_total}"
            },
            {
              type: "html",
              name: "warning_workers_total_byage",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of workers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>',
              visibleIf: "{RO_workers_age_total} > {workers_total}"
            }
          ]
        },
        {
          type: "panel",
          name: "workers_female_summary_byage",
          title: "Total number of female workers employed by your organization: {workers_female}",
          elements: [
            {
              type: "expression",
              name: "RO_workers_age_female_total",
              title: "Number of female workers reported in an age group:",
              hideNumber: true,
              displayStyle: "decimal",
              expression:
                "{workers_female_16_28}+{workers_female_29_35}+{workers_female_36}"
            },
            {
              type: "expression",
              name: "RO_workers_age_female_unknown",
              title: "Number of female workers (age unknown):",
              hideNumber: true,
              displayStyle: "decimal",
              startWithNewLine: false,
              expression:
                "{workers_female}-{RO_workers_age_female_total}"
            },
            {
              type: "html",
              name: "warning_workers_female_byage",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of female workers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>',
              visibleIf: "{RO_workers_age_female_total} > {workers_female}"
            }
          ]
        },
        {
          type: "panel",
          name: "workers_male_summary_byage",
          title: "Total number of male workers employed by your organization: {workers_male}",
          elements: [
            {
              type: "expression",
              name: "RO_workers_age_male_total",
              title: "Number of male workers reported in an age group:",
              hideNumber: true,
              startWithNewLine: false,
              displayStyle: "decimal",
              expression:
                "{workers_male_16_28}+{workers_male_29_35}+{workers_male_36}"
            },
            {
              type: "expression",
              name: "RO_workers_age_male_unknown",
              title: "Number of male workers (age unknown):",
              hideNumber: true,
              startWithNewLine: false,
              displayStyle: "decimal",
              expression:
                "{workers_male}-{RO_workers_age_male_total}"
            },
            {
              type: "html",
              name: "warning_workers_male_byage",
              hideNumber: true,
              html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of male workers by age group is greater than the total reported on the previous page. Please correct the error before moving on.</span>\n</div>',
              visibleIf: "{RO_workers_age_male_total} > {workers_male}"
            }
          ]
        }
          ]
        }
      ]
    },
    {
      name: "Total Land Area",
      title: "Land area under cultivation by your organization",
      visibleIf: "{consent_to_participate} = 'consent'",
      elements: [
        {
          type: "panel",
          name: "instructions_landarea",
          elements: [
            {
              type: "html",
              name: "info_box_production",
              hideNumber: true,
              html: "<br>Another key area of information that Fairtrade stakeholders and consumers are interested in is the production of Fairtrade certified products. This helps Fairtrade understand our producer organizations; analyse growth, yields and market potential over time; and guide our global strategy."
            },
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
                  text: "Fairtrade land area is larger than total land area.",
                  expression:
                    "{total_land_managed} >= {total_area_ft_certification} OR {total_land_managed} empty OR {total_area_ft_certification} empty"
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
      visibleIf: "{consent_to_participate} = 'consent'",
      elements: [
        {
          type: "panel",
          name: "instructions_products_page",
          elements: [
            {
              type: "html",
              name: "info_box_production",
              hideNumber: true,
              html: "<br>Another key area of information that Fairtrade stakeholders and consumers are interested in is the production of Fairtrade certified products. This helps Fairtrade understand our producer organizations; analyse growth, yields and market potential over time; and guide our global strategy.<br><br>In addition, a new indicator that we want to better understand is the forecasted volumes (volumes on offer) that are of export quality and can be sold on Fairtrade terms. In the future, information like this could be used (by authorised staff at Fairtrade International and the Producer Networks) to seek new market opportunities."
            },
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
                "<br>Note that <u>some units should only be used for specific products</u>. For guidance on which units to use for your organization's products, please see the information box below."
            },
            {
              type: "html",
              name: "info_box_navigation",
              hideNumber: true,
              html:
                "<br>How to enter information about your organization's Fairtrade certified products:<i><ul><li>Enter the information for each product one at a time. To start reporting on your first product, select the 'Add product' botton.</li><li>From the dropdown list, select the product. Note, the first dropdown list helps you to narrow down your search by product category (ex: coffee, vegetables). Once selected, a second dropdown list will appear from which you can select the product.</li><li>Proceed to enter the land area, volumes produced and forecast volumes for your first product.</li><li>When you reach the bottom of the page, you have the option to add additional products by selecting the 'Add product' button. You can add as many Fairtrade products as needed.</li><li>Proceed to enter the information for the rest of your Fairtrade products.</li><li>Go back to the previous or next product by using the navigation buttons at the bottom of the page.</li><li>To remove all information about a product, select 'Remove this product' at the bottom of the page.</li></ul></i>"
            }
          ]
        },
        {
          type: "panel",
          name: "volume_units_panel",
          title: "Information box: Units for reporting volumes produced",
          elements: [
        {
         "type": "boolean",
         "name": "hide_unit_info_box",
         "title": "Toggle between \"Show\" and \"Hide\" to display",
         "labelTrue": "Hide",
         "labelFalse": "Show",
          defaultValue: false,
          hideNumber: true
        },
        {
          type: "panel",
          name: "unit_descriptions_panel",
          visibleIf: "{hide_unit_info_box} = false",
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
                "<hr><b>Quintales (46 kg):</b> Use quintales when you know the volume of your product in quintales (1 quintal = 100 lbs = 46 kg)."
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
                "If your product was not listed and you selected 'other' please specify here the product for which your organization produced under Fairtrade certification:",
              visibleIf:
                "{panel.minor_product_category} contains 'Other' OR {panel.minor_product_category} contains 'other'"
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
                    },
                    {
                      type: "expression",
                      text:
                        "The sum of organic and conventional land is greater than the total. Please correct the error.",
                      expression:
                        "({panel.land_total_production} empty OR {panel.land_total_production} >= ({panel.land_conventional_production}+{panel.land_organic_production})) OR {organic_logic} <> 'mixed'"
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
                      text: "Conventional land area is greater than total land area. Please correct the error.",
                      expression: "{panel.land_total_production} empty OR {panel.land_conventional_production} empty OR {panel.land_total_production} >= {panel.land_conventional_production}"
                    }
                  ]
                },
                {
                  type: "text",
                  name: "land_organic_production",
                  title:
                    "How many {land_area_unit} of land was under cultivation of, or in transition to, organic certification?",
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
                      text: "Organic land area is greater than total land area. Please correct the error.",
                      expression: "{panel.land_total_production} empty OR {panel.land_organic_production} empty OR {panel.land_total_production} >= {panel.land_organic_production}"
                    }
                  ]
                },
                {
                  type: "html",
                  name: "warning_land_area_sum",
                  hideNumber: true,
                  html: '<br><div style="background-color: #ffd6d6; padding: 8px; border: 1px solid red; border-radius:8px"><h3 style="margin: auto; color: red; font-weight: bold">Warning!</h3>\n<span style="font-size: medium;">The sum of conventional and organic land area is less than the total. Please double check that the numbers reported are correct before moving on.</span>\n</div>',
                  visibleIf: "{panel.land_total_production} > {panel.land_conventional_production}+{panel.land_organic_production} AND {panel.land_conventional_production} notempty AND {panel.land_organic_production} notempty AND {organic_logic} = 'mixed'"                
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
                 /* visibleIf:
                    "({panel.minor_product_category} contains 'Other' OR {panel.minor_product_category} contains 'other') AND {panel.product_form_name} notempty"
                }, */
                visibleIf: "screenValue('product_form_name') contains 'Other' OR screenValue('product_form_name') contains 'other'"
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
                    "How many {panel.volume_produced_unit} of {panel.product_form_name} did your organization produce under, or in transition to, organic certification?",
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
                  name: "volume_produced_total_calc",
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
                    "How many {panel.volume_forecast_unit} of {panel.product_form_name} produced under, or in transition to, organic certification does your organization forecast will be of export quality?",
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
      ]
    },
    {
      name: "feedback_fairinsight",
      title: "Your Feedback on FairInsight & Reporting Information to Fairtrade",
      navigationTitle: "Your Feedback",
      /*navigationDescription: "of your organization",*/
      visibleIf: "{consent_to_participate} = 'consent'",
      elements: [
        {
          type: "panel",
          name: "feedback_instructions_panel",
          elements: [
        {
          type: "html",
          name: "feedback_instructions",
          hideNumber: true,
          html: "<br><b>Thank you for filling out our survey</b>, it covered a set of questions related to some of Fairtrade's most frequently used data. Your contributions will help us better understand challenges in reporting and the quality of the data being reported.<br><br>In this section, we would appreciate to hear from you on the challenges, suggestions and feedback that you and your organization have relating to reporting information to Fairtrade and FairInsight. We would appreciate any feedback you may be willing to share. We will only use your feedback on this page to identify common challenges faced by producer organizations and assess solutions for improvements."
        }
      ]
    },
        {
          type: "panel",
          name: "survey_feedback",
          title: "Your survey experience",
          elements: [
        {
          type: "rating",
          name: "rating_survey_overall",
          hideNumber: true,
          minRateDescription: "(Very Difficult)",
          maxRateDescription: "(Very Easy)",
          title: "On a scale of 1 to 5, how easy overall was it to fill out the information in this survey?"
              },
              {
                type: "rating",
                name: "rating_survey_questions",
                hideNumber: true,
                minRateDescription: "(Very Difficult)",
                maxRateDescription: "(Very Easy)",
                title: "On a scale of 1 to 5, how easy was it to understand the questions and what was being asked?"
              },
              {
                type: "rating",
                name: "rating_survey_content",
                hideNumber: true,
                minRateDescription: "(Not at all Relevant)",
                maxRateDescription: "(Very Relevant)",
                title: "On a scale of 1 to 5, how relevant were the questions to your organization?"
              },
              {
                type: "comment",
                name: "textbox_issues_survey",
                hideNumber: true,
                title: "When completing this survey, did you have any issues or trouble with any parts of the survey? If so, please explain here (max. 500 characters):",
                maxLength: 500
              },
              {
                type: "comment",
                name: "textbox_suggestions_survey",
                hideNumber: true,
                title: "We want to improve how we collect this type of information from Fairtrade producer organizations. Do have any suggestions for improving the survey in any way (on the questions, functionality, accessibility, etc.) that you would like to share? (max. 500 characters):",
                maxLength: 500
              }
            ]
          },
          {
            type: "panel",
            name: "reporting_feedback",
            title: "Reporting information to Fairtrade",
            elements: [
              {
                type: "comment",
                name: "textbox_reporting",
                hideNumber: true,
                title: "We want to better understand the challenges that producer organizations face when asked to report information to Fairtrade. Does your organization have any challenges that you would like to share with us? (max. 500 characters)",
                maxLength: 500
              }
            ]
          },
          {
            type: "panel",
            name: "fairinsight_feedback",
            title: "FairInsight usage",
            elements: [
              {
                type: "rating",
                name: "rating_fairinsight",
                hideNumber: true,
                minRateDescription: "(Very Difficult)",
                maxRateDescription: "(Very Easy)",
                title: "On a scale of 1 to 5, how easy do you find it to use FairInsight to report on your Fairtrade Premium Investments?"
              },
              {
                type: "comment",
                name: "textbox_fairinsight_not_easy",
                hideNumber: true,
                visibleIf: "{rating_fairinsight} < 4",
                title: "How can we improve your user experience to make reporting on your Fairtrade Premium Investments easier? (max. 500 characters)",
                maxLength: 500
              },
              {
                type: "rating",
                name: "rating_fairinsight_usefulness",
                hideNumber: true,
                minRateDescription: "(Not at all Useful)",
                maxRateDescription: "(Very Useful)",
                title: "On a scale of 1 to 5, how useful do you see FairInsight being for your organization?"
              },
              {
                type: "comment",
                name: "textbox_fairinsight_not_useful",
                hideNumber: true,
                visibleIf: "{rating_fairinsight_usefulness} < 4",
                title: "How can we make FairInsight more useful for your organization? (max. 500 characters)",
                maxLength: 500
              },
              {
                type: "comment",
                name: "textbox_fairinsight",
                hideNumber: true,
                title: "Do you have any other comments, suggestions or feedback you would like to share with us about FairInsight? (max. 500 characters)",
                maxLength: 500
              }
            ]
          },
          {
            type: "panel",
            name: "thank_you_panel",
            elements: [
          {
            type: "html",
            name: "thank_you",
            hideNumber: true,
            html: "<br><b>Thank you for your feedback!</b> We want to make reporting easier for you and your organization through FairInsight. We will review your inputs and keep them in mind for further improvements to the platform."
          }
        ]
      }
      ]
    }
  ],
  checkErrorsMode: "onValueChanged"
};

function screenValue(params) {
  if (!params && params.length < 1) return false;

  var question = this.question.parent.getQuestionByName(params[0]);

  if (!question) return undefined;
  var selItem = question.selectedItem;
  var res = !!selItem ? selItem.text : undefined;
  return res;
}

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
