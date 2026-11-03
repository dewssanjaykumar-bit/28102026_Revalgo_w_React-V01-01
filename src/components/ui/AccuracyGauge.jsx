import { useMemo } from "react";
import Highcharts from "highcharts";
import "highcharts/highcharts-more";
import "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";

export default function AccuracyGauge({ quotes }) {
  const value = quotes.length
    ? Math.round(
        (quotes.filter((q) => q.status.toLowerCase() === "approved").length /
          quotes.length) *
          100,
      )
    : 0;

  const options = useMemo(
    () => ({
      chart: {
        type: "gauge",
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: "light-dark( #171A21, #F7F9FC)",
      },

      title: {
        text: "",
      },

      accessibility: {
        enabled: false,
      },

      pane: {
        startAngle: -90,
        endAngle: 89.9,
        background: null,
        center: ["50%", "80%"],
        size: "112%",
      },
      credits: {
        enabled: false,
      },

      yAxis: {
        min: 0,
        max: 100,
        tickPixelInterval: 72,
        tickPosition: "inside",
        tickPositions: [0, 100],
        tickColor: "white",
        tickLength: 72,
        tickWidth: 0,
        minorTickWidth: 0,
        minorTickInterval: null,
        labels: {
          distance: -5,
          y: 15,
          style: {
            fontSize: "12px",
            color: "#222222",
          },
        },
        lineWidth: 0,
        plotBands: [
          { from: 0, to: 5, color: "#DF5353", thickness: 6 },
          { from: 5, to: 10, color: "#E45A49", thickness: 7 },
          { from: 10, to: 15, color: "#E9633F", thickness: 8 },
          { from: 15, to: 20, color: "#EE6C35", thickness: 9 },
          { from: 20, to: 25, color: "#F3752B", thickness: 10 },
          { from: 25, to: 30, color: "#F68728", thickness: 11 },
          { from: 30, to: 35, color: "#F89B25", thickness: 12 },
          { from: 35, to: 40, color: "#FBAF22", thickness: 13 },
          { from: 40, to: 45, color: "#FDC31F", thickness: 14 },
          { from: 45, to: 50, color: "#FFD61C", thickness: 15 },
          { from: 50, to: 55, color: "#FFE53B", thickness: 16 },
          { from: 55, to: 60, color: "#F4E94C", thickness: 17 },
          { from: 60, to: 65, color: "#E4EB59", thickness: 18 },
          { from: 65, to: 70, color: "#D1EC5F", thickness: 19 },
          { from: 70, to: 75, color: "#BEEB5F", thickness: 20 },
          { from: 75, to: 80, color: "#A7E05B", thickness: 21 },
          { from: 80, to: 85, color: "#7FD152", thickness: 22 },
          { from: 85, to: 90, color: "#55BF3B", thickness: 23 },
          { from: 90, to: 95, color: "#3DB233", thickness: 24 },
          { from: 95, to: 100, color: "#2EAD2E", thickness: 25 },
        ],
      },

      series: [
        {
          name: "Accuracy",
          data: [78.6],
          dataLabels: {
            format: "{y}",
            borderWidth: 0,
            style: {
              fontSize: "12px",
            },
          },
          dial: {
            radius: "80%",
            backgroundColor: "black",
            baseWidth: 8,
            baseLength: "0%",
            rearLength: "0%",
          },
          pivot: {
            backgroundColor: "gray",
            radius: 4,
          },
        },
      ],
    }),
    [value],
  );

  return (
    <div id="gauge-chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
