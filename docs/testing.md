# Testing

## Test Plan

Use Case 1 geolocate unit test - success 
Tested whether geolocate function returns a value

Use case 2 empty search unit test - success
Tested whether an empty query would return any records

Use case 3 error response test - success
Tested whether an error message was returned when connection to the database fails.


### Test Runs

| Use-Case ID | Requirement ID | Test Case | Status |

| ----UC1---- | -----FR1------ | The system should get user geo-location | -PASS- |

| ----UC1---- | -----FR2------ | The system must display to the user the route from two locations on a map | -PASS- |

| ----UC2---- | -----FR4------ | The system must show ward by crime rate | -PASS- |

| ----UC2---- | -----FR5------ | The system should only show other crime rates if the user specifies | -PASS- |

| ----UC3---- | -----FR6------ | The system must show crime rate by year | -PASS- |

| ----UC3---- | -----FR7------ | The system must show crime rate by ward | -PASS- |

| ----UC3---- | -----FR8------ | The system should show a bristol map by colour coded by crime rate | -PASS- |

| ----UC4---- | -----FR9------ | The system must add user reports to a database | -PASS- |

| ----UC4---- | -----FR10----- | The system could validate user input for reporting using a captcha | -FAIL- |

| ----UC1---- | -----NFR1----- | The map must fill over half the page | -PASS- |

| ----UC1---- | -----NFR2----- | The map must not conflict with or cover any other element on the page | -PASS- |

| ----UC1---- | -----NFR3----- | Table should highlight the record the user is hovering over | -PASS- |

| ----UC1---- | -----NFR4----- | The system should show the same data from the same query | -PASS- |

| ----UC1---- | -----NFR5----- | The home and report pages must work on mobile platforms | -PASS- |

| ----UC1---- | -----NFR6----- | Must display all data from a query on one table for quick access | -PASS- |

| ----UC1---- | -----NFR8----- | NFR8: Search bar must not show data on erroneous inputs (UC3) | -PASS- |

