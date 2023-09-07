import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  Breadcrumbs as MuiBreadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { IconTallymark1 } from '@tabler/icons';
import { BASE_PATH } from 'config';
import { gridSpacing } from 'aida-constants';
import useAida from 'hooks/useAida';

const MAX_BREADCRUMB_DETAIL_LENGTH = 24;
// eslint-disable-next-line no-unused-vars
const Breadcrumbs = ({ card, divider, icon, icons, maxItems, navigation, rightAlign, separator, title, titleBottom, ...others }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const [item, setItem] = useState();

  useEffect(() => {
    // set active item state
    const findActive = (menu) => {
      if (menu.children) {
        for (const child of menu.children) {
          if (child.type && child.type === 'collapse') {
            if (findActive(child)) return true;
          }

          if (child.type && child.type === 'item') {
            if (pathname.startsWith(BASE_PATH + child.url)) {
              setItem(child);
              return true;
            }
          }
        }
      }

      return false;
    };

    setItem(null);
    if (Array.isArray(navigation?.items)) {
      for (const menu of navigation.items) {
        if (menu.type === 'group') {
          if (findActive(menu)) break;
        }
      }
    }
  }, [navigation?.items, pathname]);

  // item separator
  const SeparatorIcon = separator;
  const separatorIcon = separator ? <SeparatorIcon stroke={1.5} size="1rem" /> : <IconTallymark1 stroke={1.5} size="1rem" />;

  let breadcrumbContent = <Typography />;

  const { getCurrentProjectIdName, getDetailInfo } = useAida();
  const [projectId, projectName] = getCurrentProjectIdName();
  // items
  if (item && item.type === 'item') {
    const projectArr = item.url.includes('deposition')
      ? [
          ['Projects', '/'],
          [projectName, `/projects/${projectId}/deposition/dashboard`],
          ['Deposition', item.url],
          [item.title, item.url]
        ]
      : [
          ['Projects', '/'],
          [projectName, `/projects/${projectId}/dashboard`],
          [item.title, item.url]
        ];

    const detail = getDetailInfo();
    if (detail) {
      const { title, link } = detail;
      if (title && link) {
        if (title.length > MAX_BREADCRUMB_DETAIL_LENGTH) {
          projectArr.push([`${title.substring(0, MAX_BREADCRUMB_DETAIL_LENGTH)} ...`, link]);
        } else {
          projectArr.push([title, link]);
        }
      }
    }

    const projectContent = projectArr.map(([itemCaption, itemUrl], idx) => (
      <MuiLink
        component={Link}
        key={idx}
        underline="hover"
        sx={{
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          color: 'grey.500',
          textTransform: 'capitalize',
          fontWeight: 500
        }}
        to={itemUrl}
      >
        {itemCaption}
      </MuiLink>
    ));

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <Card
          sx={{
            marginBottom: card === false ? 0 : theme.spacing(gridSpacing),
            border: card === false ? 'none' : '1px solid',
            borderColor:
              theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75,
            background: card === false ? 'transparent' : theme.palette.background.default
          }}
          {...others}
        >
          <Box sx={{ p: 2, pl: card === false ? 0 : 2 }}>
            <Grid
              container
              direction={rightAlign ? 'row' : 'column'}
              justifyContent={rightAlign ? 'space-between' : 'flex-start'}
              alignItems={rightAlign ? 'center' : 'flex-start'}
              spacing={1}
            >
              {title && !titleBottom && (
                <Grid item>
                  <Typography variant="h3" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Grid>
              )}
              <Grid item>
                <MuiBreadcrumbs
                  sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                  aria-label="breadcrumb"
                  maxItems={maxItems || 8}
                  separator={separatorIcon}
                >
                  {projectContent}
                </MuiBreadcrumbs>
              </Grid>
              {title && titleBottom && (
                <Grid item>
                  <Typography variant="h3" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
          {card === false && divider !== false && (
            <Divider sx={{ borderColor: theme.palette.primary.main, mb: gridSpacing }} />
          )}
        </Card>
      );
    }
  }

  return breadcrumbContent;
};

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  divider: PropTypes.bool,
  icon: PropTypes.bool,
  icons: PropTypes.bool,
  maxItems: PropTypes.number,
  navigation: PropTypes.object,
  rightAlign: PropTypes.bool,
  separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  title: PropTypes.bool,
  titleBottom: PropTypes.bool
};

export default Breadcrumbs;
