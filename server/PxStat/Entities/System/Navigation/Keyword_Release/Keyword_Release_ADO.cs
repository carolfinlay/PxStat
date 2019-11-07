﻿using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using API;

namespace PxStat.System.Navigation
{
    /// <summary>
    /// ADO for Keyword Release
    /// </summary>
    internal class Keyword_Release_ADO
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public Keyword_Release_ADO()
        {
        }

        /// <summary>
        /// Reads a Keyword Release. Optional parameters are KrlCode and RlsCode
        /// </summary>
        /// <param name="ado"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        internal ADO_readerOutput Read(ADO ado, Keyword_Release_DTO dto)
        {
            ADO_readerOutput output = new ADO_readerOutput();
            var inputParams = new List<ADO_inputParams>();
            if (dto.KrlCode != default(int))
                inputParams.Add(new ADO_inputParams() { name = "@KrlCode", value = dto.KrlCode });
            if (dto.RlsCode != default(int))
                inputParams.Add(new ADO_inputParams() { name = "@RlsCode", value = dto.RlsCode });

            output = ado.ExecuteReaderProcedure("System_Navigation_Keyword_Release_Read", inputParams);

            return output;
        }

        /// <summary>
        /// This method creates a single KeywordRelease. It is intended for non-mandatory keywords
        /// </summary>
        /// <param name="ado"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        internal int Create(ADO ado, Keyword_Release_DTO dto)
        {
            var inputParams = new List<ADO_inputParams>()
                {
                    new ADO_inputParams() {name ="@KrlValue",value= dto.KrlValue},
                     new ADO_inputParams() {name ="@RlsCode",value= dto.RlsCode},
                     new ADO_inputParams() {name ="@KrlMandatoryFlag",value= dto.KrlMandatoryFlag? 1: 0},
                     new ADO_inputParams() {name ="@KrlSingularisedFlag",value= dto.LngIsoCode!=null}
                };


            var returnParam = new ADO_returnParam() { name = "@ReturnVal", value = 0 };

            ado.ExecuteNonQueryProcedure("System_Navigation_Keyword_Release_Create", inputParams, ref returnParam);


            return (int)returnParam.value;
        }

        /// <summary>
        /// Update a Keyword Release
        /// </summary>
        /// <param name="ado"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        internal int Update(ADO ado, Keyword_Release_DTO dto)
        {
            var inputParams = new List<ADO_inputParams>()
                {
                    new ADO_inputParams() {name ="@KrlValue",value= dto.KrlValue},
                     new ADO_inputParams() {name ="@KrlCode",value= dto.KrlCode},
                     new ADO_inputParams() {name ="@KrlSingularisedFlag",value= dto.LngIsoCode!=null}
                };

            var returnParam = new ADO_returnParam() { name = "@ReturnVal", value = 0 };

            ado.ExecuteNonQueryProcedure("System_Navigation_Keyword_Release_Update", inputParams, ref returnParam);

            return (int)returnParam.value;
        }

        /// <summary>
        /// Delete Keyword Release. This may be based on ReleaseCode, KeywordReleaseCode or both. 
        /// The stored procedure requires at least one of the above paramters.
        /// </summary>
        /// <param name="ado"></param>
        /// <param name="rlsCode"></param>
        /// <param name="mandatoryValue"></param>
        /// <returns></returns>
        internal int Delete(ADO ado, int? rlsCode, int? krlCode, bool? mandatoryValue)
        {
            var inputParams = new List<ADO_inputParams>();
            if (rlsCode != null)
            {
                inputParams.Add(new ADO_inputParams() { name = "@RlsCode", value = rlsCode });
            }

            if (krlCode != null)
            {
                inputParams.Add(new ADO_inputParams() { name = "@KrlCode", value = krlCode });
            }

            if (mandatoryValue != null)
            {
                inputParams.Add(new ADO_inputParams() { name = "@KrlMandatoryFlag", value = mandatoryValue });
            }

            var returnParam = new ADO_returnParam() { name = "@ReturnVal", value = 0 };
            ado.ExecuteNonQueryProcedure("System_Navigation_Keyword_Release_Delete", inputParams, ref returnParam);
            return (int)returnParam.value;

        }

        /// <summary>
        /// Creates new keyword entries by bulk loading a table to the TD_KEYWORD_RELEASE table
        /// </summary>
        /// <param name="Ado"></param>
        /// <param name="dt"></param>
        internal void Create(ADO Ado, DataTable dt)
        {
            //Before bulk inserting, we must map our datatable to the database table, column by column
            var maps = new List<SqlBulkCopyColumnMapping>()
                {
                    new SqlBulkCopyColumnMapping("KRL_VALUE", "KRL_VALUE"),
                    new SqlBulkCopyColumnMapping("KRL_RLS_ID", "KRL_RLS_ID"),
                    new SqlBulkCopyColumnMapping("KRL_MANDATORY_FLAG", "KRL_MANDATORY_FLAG"),
                    new SqlBulkCopyColumnMapping("KRL_SINGULARISED_FLAG","KRL_SINGULARISED_FLAG")
                };

            Ado.ExecuteBulkCopy("TD_KEYWORD_RELEASE", maps, dt, true);
        }
    }
}
