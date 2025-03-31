"use client";
import React, { useState } from "react";

interface FinancialItem {
  id: string;
  name: string;
  indent: number;
  period77: string;
  period76: string;
  period75: string;
}

export default function FinancialPositionPage() {
  const [financialData, setFinancialData] = useState<FinancialItem[]>([
    // 자산
    { id: '1', name: '자산', indent: 0, period77: '', period76: '', period75: '' },
    { id: '2', name: '유동자산', indent: 1, period77: '', period76: '', period75: '' },
    { id: '3', name: '현금및현금성자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '4', name: '단기금융상품', indent: 2, period77: '', period76: '', period75: '' },
    { id: '5', name: '단기투자자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '6', name: '매출채권', indent: 2, period77: '', period76: '', period75: '' },
    { id: '7', name: '기타수취채권', indent: 2, period77: '', period76: '', period75: '' },
    { id: '8', name: '기타금융자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '9', name: '재고자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '10', name: '당기법인세자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '11', name: '매각예정자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '12', name: '기타유동자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '13', name: '비유동자산', indent: 1, period77: '', period76: '', period75: '' },
    { id: '14', name: '관계기업 및 공동기업투자', indent: 2, period77: '', period76: '', period75: '' },
    { id: '15', name: '장기투자자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '16', name: '기타수취채권', indent: 2, period77: '', period76: '', period75: '' },
    { id: '17', name: '기타금융자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '18', name: '유형자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '19', name: '사용권자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '20', name: '무형자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '21', name: '투자부동산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '22', name: '이연법인세자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '23', name: '종업원급여자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '24', name: '기타비유동자산', indent: 2, period77: '', period76: '', period75: '' },
    { id: '25', name: '자산총계', indent: 0, period77: '', period76: '', period75: '' },

    // 부채
    { id: '26', name: '부채', indent: 0, period77: '', period76: '', period75: '' },
    { id: '27', name: '유동부채', indent: 1, period77: '', period76: '', period75: '' },
    { id: '28', name: '매입채무', indent: 2, period77: '', period76: '', period75: '' },
    { id: '29', name: '미지급금', indent: 2, period77: '', period76: '', period75: '' },
    { id: '30', name: '기타지급채무', indent: 2, period77: '', period76: '', period75: '' },
    { id: '31', name: '차입금', indent: 2, period77: '', period76: '', period75: '' },
    { id: '32', name: '기타금융부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '33', name: '충당부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '34', name: '당기법인세부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '35', name: '리스부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '36', name: '기타유동부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '37', name: '비유동부채', indent: 1, period77: '', period76: '', period75: '' },
    { id: '38', name: '장기미지급금', indent: 2, period77: '', period76: '', period75: '' },
    { id: '39', name: '기타지급채무', indent: 2, period77: '', period76: '', period75: '' },
    { id: '40', name: '차입금', indent: 2, period77: '', period76: '', period75: '' },
    { id: '41', name: '기타금융부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '42', name: '충당부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '43', name: '확정급여부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '44', name: '이연법인세부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '45', name: '리스부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '46', name: '기타비유동부채', indent: 2, period77: '', period76: '', period75: '' },
    { id: '47', name: '부채총계', indent: 0, period77: '', period76: '', period75: '' },

    // 자본
    { id: '48', name: '자본', indent: 0, period77: '', period76: '', period75: '' },
    { id: '49', name: '지배기업의 소유지분', indent: 1, period77: '', period76: '', period75: '' },
    { id: '50', name: '자본금', indent: 2, period77: '', period76: '', period75: '' },
    { id: '51', name: '자본잉여금', indent: 2, period77: '', period76: '', period75: '' },
    { id: '52', name: '기타자본', indent: 2, period77: '', period76: '', period75: '' },
    { id: '53', name: '기타포괄손익누계액', indent: 2, period77: '', period76: '', period75: '' },
    { id: '54', name: '이익잉여금', indent: 2, period77: '', period76: '', period75: '' },
    { id: '55', name: '비지배지분', indent: 1, period77: '', period76: '', period75: '' },
    { id: '56', name: '자본총계', indent: 0, period77: '', period76: '', period75: '' },
    { id: '57', name: '부채및자본총계', indent: 0, period77: '', period76: '', period75: '' },
  ]);

  const handleInputChange = (id: string, period: 'period77' | 'period76' | 'period75', value: string) => {
    setFinancialData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [period]: value } : item
      )
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">연결 재무상태표</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  계정과목
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제77기
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제76기
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제75기
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financialData.map((item) => (
                <tr key={item.id} className={item.indent === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span style={{ marginLeft: `${item.indent * 20}px` }}>
                      {item.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="number"
                      value={item.period77}
                      onChange={(e) => handleInputChange(item.id, 'period77', e.target.value)}
                      className="w-full text-right border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="number"
                      value={item.period76}
                      onChange={(e) => handleInputChange(item.id, 'period76', e.target.value)}
                      className="w-full text-right border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="number"
                      value={item.period75}
                      onChange={(e) => handleInputChange(item.id, 'period75', e.target.value)}
                      className="w-full text-right border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}