import { forwardRef, useState } from 'react';
import { Card, CardHeader, CardContent, IconButton, Stack, TextField, InputAdornment, Button, Box, CircularProgress } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseIcon from '@mui/icons-material/Close';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import WorkOutlineTwoToneIcon from '@mui/icons-material/WorkOutlineTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import CorporateFareTwoToneIcon from '@mui/icons-material/CorporateFareTwoTone';
import { useFormik, FieldArray, getIn, ErrorMessage, FormikProvider } from 'formik';
import * as yup from 'yup';
import PerfectScrollbar from 'react-perfect-scrollbar';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid Email'),
  emailAliases: yup.array().of(yup.string().email('Enter a valid Email'))
});
export const CustodianCreateForm = forwardRef(({ onClose, onCreate }, ref) => {
  const [creating, setCreating] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      firstName: '',
      middleName: '',
      lastName: '',
      nameAliases: [],
      organization: '',
      title: '',
      titleAliases: [],
      email: '',
      emailAliases: []
    },
    validationSchema,
    onSubmit: async (values) => {
      setCreating(true);
      await onCreate?.(values);
      setCreating(false);
      onClose();
    }
  });

  return (
    <Card square ref={ref} sx={{ width: 450, zIndex: 1101 }}>
      <CardHeader
        action={
          <IconButton aria-label="close" onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        }
        title="New Custodian"
        sx={{ bgcolor: '#C9F0F0' }}
      />

      <CardContent sx={{ '& ::-webkit-scrollbar': { width: 0 } }}>
        <PerfectScrollbar style={{ overflowY: 'auto !important', height: 'calc(100vh - 128px)', padding: '8px' }}>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />

                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />

                <TextField
                  fullWidth
                  name="middleName"
                  label="Middle Name"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                  helperText={formik.touched.middleName && formik.errors.middleName}
                />

                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />

                <FieldArray
                  name="nameAliases"
                  render={(arrayHelpers) => (
                    <Stack spacing={3}>
                      {formik.values.nameAliases.map((_, index) => (
                        <TextField
                          key={index}
                          fullWidth
                          name={`nameAliases[${index}]`}
                          label="Name"
                          value={formik.values.nameAliases[index]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={getIn(formik.errors, `nameAliases[${index}]`) && getIn(formik.touched, `nameAliases[${index}]`)}
                          helperText={<ErrorMessage name={`nameAliases[${index}]`} />}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BadgeTwoToneIcon sx={{ width: '1rem', height: '1rem' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => arrayHelpers.remove(index)}>
                                  <CloseIcon sx={{ width: '1rem', height: '1rem' }} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      ))}

                      <Box>
                        <Button
                          variant="text"
                          startIcon={<AddCircleOutlineRoundedIcon />}
                          onClick={() => arrayHelpers.push('')}
                        >
                          Add new name
                        </Button>
                      </Box>
                    </Stack>
                  )}
                />

                <TextField
                  fullWidth
                  name="organization"
                  label="Organization"
                  value={formik.values.organization}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.organization && Boolean(formik.errors.organization)}
                  helperText={formik.touched.organization && formik.errors.organization}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CorporateFareTwoToneIcon sx={{ width: '1rem', height: '1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  name="title"
                  label="Job Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkOutlineTwoToneIcon sx={{ width: '1rem', height: '1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <FieldArray
                  name="titleAliases"
                  render={(arrayHelpers) => (
                    <>
                      {formik.values.titleAliases.map((_, index) => (
                        <TextField
                          key={index}
                          fullWidth
                          name={`titleAliases[${index}]`}
                          label="Job Title"
                          value={formik.values.titleAliases[index]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            getIn(formik.errors, `titleAliases[${index}]`) &&
                            getIn(formik.touched, `titleAliases[${index}]`)
                          }
                          helperText={<ErrorMessage name={`titleAliases[${index}]`} />}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <WorkOutlineTwoToneIcon sx={{ width: '1rem', height: '1rem' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => arrayHelpers.remove(index)}>
                                  <CloseIcon sx={{ width: '1rem', height: '1rem' }} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      ))}

                      <Box>
                        <Button
                          variant="text"
                          startIcon={<AddCircleOutlineRoundedIcon />}
                          onClick={() => arrayHelpers.push('')}
                        >
                          Add new title
                        </Button>
                      </Box>
                    </>
                  )}
                />

                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailTwoToneIcon sx={{ width: '1rem', height: '1rem' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <FieldArray
                  name="emailAliases"
                  render={(arrayHelpers) => (
                    <>
                      {formik.values.emailAliases.map((_, index) => (
                        <TextField
                          key={index}
                          fullWidth
                          name={`emailAliases[${index}]`}
                          label="Email"
                          value={formik.values.emailAliases[index]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            getIn(formik.errors, `emailAliases[${index}]`) &&
                            getIn(formik.touched, `emailAliases[${index}]`)
                          }
                          helperText={<ErrorMessage name={`emailAliases[${index}]`} />}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailTwoToneIcon sx={{ width: '1rem', height: '1rem' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => arrayHelpers.remove(index)}>
                                  <CloseIcon sx={{ width: '1rem', height: '1rem' }} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      ))}

                      <Box>
                        <Button
                          variant="text"
                          startIcon={<AddCircleOutlineRoundedIcon />}
                          onClick={() => arrayHelpers.push('')}
                        >
                          Add new email
                        </Button>
                      </Box>
                    </>
                  )}
                />
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
                <Button variant="contained" size="small" type="submit" sx={{ minWidth: 120 }}>
                  Save
                  {creating && <CircularProgress color='warning' size={16} sx={{ ml: 2 }} />}
                </Button>
                <Button variant="outlined" size="small" onClick={onClose} sx={{ minWidth: 120 }}>
                  Cancel
                </Button>
              </Box>
            </form>
          </FormikProvider>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  )
});
