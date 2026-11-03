import { act, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { vw } from "../../utils/helpers";

export default function TrendChart({ quotes, activeTab = "all" }) {
  const tabQuoteCount =
    activeTab === "all"
      ? quotes.length
      : quotes.filter((quote) => quote.status.toLowerCase() === activeTab)
          .length;

  const options = useMemo(() => {
    const trendStatus = activeTab;
    const trendLabel =
      trendStatus.charAt(0).toUpperCase() + trendStatus.slice(1);
    const byMonth = {};
    quotes.forEach((q) => {
      const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(q.receivedDate);
      if (!match) return;

      const month = Number(match[1]);
      const day = Number(match[2]);
      const year = Number(match[3]);
      const date = new Date(year, month - 1, day);
      if (
        month < 1 ||
        month > 12 ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return;
      }

      const key = `${year}-${String(month).padStart(2, "0")}`;
      byMonth[key] ??= { total: 0, pending: 0, approved: 0, deleted: 0 };
      byMonth[key].total += 1;
      const status = q.status.toLowerCase();
      if (status in byMonth[key] && status !== "total") {
        byMonth[key][status] += 1;
      }
    });

    const keys = Object.keys(byMonth).sort();
    return {
      chart: {
        type: "area",
        backgroundColor: "light-dark( #171A21, #F7F9FC)",
      },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderRadius: 8,
        shadow: false,
        style: { color: "#333" },
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.2,
          marker: {
            enabled: true,
            radius: 3,
            symbol: "circle",
          },
          lineWidth: 2,
          line: {
            color: "#505050",
          },
        },
      },
      legend: {
        align: "center",
        verticalAlign: "top",
        layout: "vertical",
        y: -21,
        x: vw(6),
        symbolRadius: 0,
        itemStyle: { fontWeight: "500", color: "#2c2c2cff", fontSize: "10px" },
      },
      accessibility: {
        enabled: false,
      },
      xAxis: {
        gridLineColor: "#575757",
        labels: {
          rotation: 0,
          style: { color: "#555", fontWeight: "500", fontSize: "11px" },
        },
        categories: keys.map((key) => {
          const [year, month] = key.split("-").map(Number);
          return new Date(year, month - 1, 1).toLocaleString("en", {
            month: "short",
          });
        }),
      },
      yAxis: {
        title: { text: undefined },
        labels: { style: { color: "#777", fontSize: "12px" } },
        allowDecimals: false,
        labels: {
          style: {
            color: "#222222",
            fontSize: "11px",
          },
        },
      },
      series: [
        {
          name: "Total",
          data: keys.map((key) => byMonth[key].total),
          lineColor: "#7049ffff",
          marker: {
            fillColor: "#7049ffff",
            radius: 2,
          },
          lineWidth: 1,
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "#037dcfe1"],
              [1, "white"],
            ],
          },
        },
        {
          name: trendLabel,
          data: keys.map(
            (key) =>
              byMonth[key][trendStatus === "all" ? "total" : trendStatus],
          ),
          color: "#2196f3",
          marker: {
            fillColor: "#2196f3",
            radius: 3,
          },
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, Highcharts.color("#2196f3").setOpacity(0.3).get("rgba")],
              [1, Highcharts.color("#2196f3").setOpacity(0).get("rgba")],
            ],
          },
        },
      ],
    };
  }, [quotes, activeTab]);

  return (
    <div className="trend-chart-wrapper">
      <div className="chart-label">
        <span className="quotes-count">{tabQuoteCount}</span> Quotes
      </div>
      <div id="line-chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
