import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { VscLoading } from "react-icons/vsc";
import axios from "../../../util/axios";
import "./AreaChart.css";

const AreaChartComponent = () => {
  const [loading, setLoading] = useState(false);
  const [orderDays, setOrderDays] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [mobileScreen, setMobileScreen] = useState();

  useEffect(() => {
    if (window.innerWidth < 450) {
      setMobileScreen(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/orders/per-day/area-chart")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setOrderDays(response.data.daysOrders);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  return (
    <div className="w-100">
      <h5
        className={mobileScreen < 450 ? "font-sm text-center" : "text-center"}
      >
        میزان فروش در روزهای گذشته
      </h5>
      {loading ? (
        <VscLoading className="loader" />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        orderDays.length > 0 && (
          <ResponsiveContainer
            width="100%"
            height={mobileScreen < 450 ? 150 : 300}
          >
            <AreaChart data={orderDays} className="area">
              <defs>
                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#728ca6" stopOpacity={0.4} />
                  <stop offset="75%" stopColor="#728ca6" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="salesAmount"
                stroke="#728ca6"
                fill="url(#color)"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString("fa", {
                    day: "numeric",
                  });
                }}
                fontSize={12}
              />

              <YAxis
                dataKey="salesAmount"
                axisLine={false}
                tickLine={false}
                tickCount={6}
                tickFormatter={(number) =>
                  `${String(number).slice(0, String(number).length - 3)}م`
                }
                fontSize={10}
                padding={0}
              />

              <Tooltip content={<CustomTooltip />} />

              <CartesianGrid opacity={0.7} vertical={false} />
            </AreaChart>
          </ResponsiveContainer>
        )
      )}
    </div>
  );
};

function CustomTooltip({ active, payload }) {
  if (active && payload[0]) {
    const date = new Date(payload[0].payload.date);

    return (
      <div className="area_cahrt_custom_tooltip">
        <strong className="font-sm">
          {date.toLocaleDateString("fa", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </strong>
        <p className="font-sm my-0">
          {payload[0].payload.salesAmount.toLocaleString("fa")} تومان
        </p>
      </div>
    );
  }
  return null;
}

export default AreaChartComponent;