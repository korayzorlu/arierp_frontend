import * as React from 'react';
import clsx from 'clsx';
import { useGridApiContext } from '@mui/x-data-grid';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Slider, { sliderClasses } from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { debounce } from '@mui/material/utils';
import { green, lime, orange, red, yellow } from '@mui/material/colors';
import { useSelector } from 'react-redux';

const Center = styled('div')({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

const Element = styled('div')(({ theme }) => ({
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 26,
  borderRadius: 2,
}));

const Value = styled('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const Bar = styled('div')({
  height: '100%',
  '&.low': {
    backgroundColor: '#f44336',
  },
  '&.medium': {
    backgroundColor: '#efbb5aa3',
  },
  '&.high': {
    backgroundColor: '#088208a3',
  },
});

const BarRisk = styled('div')(({ barColors }) => ({
  height: '100%',
  '&.low': {
    backgroundColor: barColors.low,
  },
  '&.medium': {
    backgroundColor: barColors.medium,
  },
  '&.high': {
    backgroundColor: barColors.high,
  },
}));

const ProgressBar = React.memo(function ProgressBar(props) {
  const { value } = props;
  const valueInPercent = value;
  
  return (
    <Element>
      <Value>{`% ${valueInPercent.toLocaleString()}`}</Value>
      <Bar
        className={clsx({
          low: valueInPercent < 30,
          medium: valueInPercent >= 30 && valueInPercent <= 70,
          high: valueInPercent > 70,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </Element>
  );
});

const RiskBar = React.memo(function RiskBar(props) {
  const { value } = props;
  const valueInPercent = value;
  const {dark} = useSelector((store) => store.auth);
  let text;
  if( valueInPercent < 40 ){
    text = "Düşük Risk";
  }else if( valueInPercent >= 40 && valueInPercent <= 70 ){
    text = "Orta Risk";
  }else if( valueInPercent > 70 ){
    text = "Yüksek Risk";
  }else{
    text = "Bilinmiyor";
  }

  const barColors = (dark) => {
    switch (dark) {
      case true:
        return {
          low: green[600],
          medium: orange[800],
          high: red[900],
        };
      default:
        return {
          low: green[500],
          medium: yellow[600],
          high: red[500],
        };
    }
  };

  return (
    <Element>
      {/* <Value>{`${valueInPercent.toLocaleString()}`}</Value> */}
      <Value>{`${text}`}</Value>
      <BarRisk
        className={clsx({
          low: valueInPercent < 40,
          medium: valueInPercent >= 40 && valueInPercent <= 70,
          high: valueInPercent > 70,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
        barColors={barColors(dark)}
      />
    </Element>
  );
});

const StyledSlider = styled(Slider)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: 0,
  [`& .${sliderClasses.rail}`]: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  [`& .${sliderClasses.track}`]: {
    height: '100%',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
    }),
    '&.low': {
      backgroundColor: '#f44336',
    },
    '&.medium': {
      backgroundColor: '#efbb5aa3',
    },
    '&.high': {
      backgroundColor: '#088208a3',
    },
  },
  [`& .${sliderClasses.thumb}`]: {
    height: '100%',
    width: 5,
    borderRadius: 0,
    marginTop: 0,
    backgroundColor: alpha('#000000', 0.2),
  },
}));

const ValueLabelComponent = React.memo(function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
});

function EditProgress(props) {
  const { id, value, field } = props;
  const [valueState, setValueState] = React.useState(Number(value));

  const apiRef = useGridApiContext();

  const updateCellEditProps = React.useCallback(
    (newValue) => {
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    },
    [apiRef, field, id],
  );

  const debouncedUpdateCellEditProps = React.useMemo(
    () => debounce(updateCellEditProps, 60),
    [updateCellEditProps],
  );

  const handleChange = (event, newValue) => {
    setValueState(newValue);
    debouncedUpdateCellEditProps(newValue);
  };

  React.useEffect(() => {
    setValueState(Number(value));
  }, [value]);

  const handleRef = (element) => {
    if (element) {
      element.querySelector('[type="range"]').focus();
    }
  };

  return (
    <StyledSlider
      ref={handleRef}
      classes={{
        track: clsx({
          low: valueState < 0.3,
          medium: valueState >= 0.3 && valueState <= 0.7,
          high: valueState > 0.7,
        }),
      }}
      value={valueState}
      max={1}
      step={0.00001}
      onChange={handleChange}
      components={{ ValueLabel: ValueLabelComponent }}
      valueLabelDisplay="auto"
      valueLabelFormat={(newValue) => `${(newValue * 100).toLocaleString()} %`}
    />
  );
}

export function cellRiskBar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Center>
      <RiskBar value={params.value} />
    </Center>
  );
}

export function cellProgress(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Center>
      <ProgressBar value={params.value} />
    </Center>
  );
}

export function renderEditProgress(params) {
  return <EditProgress {...params} />;
}