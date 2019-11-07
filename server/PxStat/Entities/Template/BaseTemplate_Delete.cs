﻿using System;
using FluentValidation;
using API;
using PxStat.Resources;
using System.Data;

namespace PxStat.Template
{
    /// <summary>
    /// Base Abstract class to allow for the template method pattern of Create, Read, Update and Delete objects from our model
    /// 
    /// </summary>
    internal abstract class BaseTemplate_Delete<T, V> : BaseTemplate<T, V>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="request"></param>
        /// <param name="validator"></param>
        protected BaseTemplate_Delete(JSONRPC_API request, IValidator<T> validator) : base(request, validator)
        {
        }

        /// <summary>
        /// On success
        /// </summary>
        protected override void OnExecutionSuccess()
        {
            Log.Instance.Debug("Record deleted");
            //See if there's a cache in the process. If so then we need to flush the cache.
            if (MethodReader.MethodHasAttribute(Request.method, Utility.GetCustomConfig("APP_CACHE_FLUSH_ATTRIBUTE")))
            {
                cDTO = new CacheMetadata(Utility.GetCustomConfig("APP_CACHE_FLUSH_ATTRIBUTE"), Request.method, DTO);
                foreach (Cas cas in cDTO.CasList) MemCacheD.CasRepositoryFlush(cas.CasRepository + cas.Domain);

            }
        }

        /// <summary>
        /// On error
        /// </summary>
        protected override void OnExecutionError()
        {
            Log.Instance.Debug("No record deleted");
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <returns></returns>
        public BaseTemplate_Delete<T, V> Delete()
        {
            try
            {
                // first of all, we check if user has the right to perform this operation!
                if (HasUserToBeAuthenticated())
                {
                    if (!IsUserAuthenticated() || !HasUserPrivilege())
                    {
                        return this;
                    }
                }

                //Run the parameters through the cleanse process
                dynamic cleansedParams = Cleanser.Cleanse(Request.parameters);

                DTO = GetDTO(cleansedParams);

                DTO = Sanitizer.Sanitize(DTO);

                DTOValidationResult = Validator.Validate(DTO);

                if (!DTOValidationResult.IsValid)
                {
                    OnDTOValidationError();
                    return this;
                }

                Ado.StartTransaction(IsolationLevel.Snapshot);

                // The Actual Creation should happen here by the specific class!
                if (!Execute())
                {
                    Ado.RollbackTransaction();
                    OnExecutionError();
                    return this;
                }

                Ado.CommitTransaction();
                OnExecutionSuccess();

                return this;
            }
            catch (FormatException formatException)
            {
                //A FormatException error has been caught, rollback the transaction, log the error and return a message to the caller
                Ado.RollbackTransaction();
                Log.Instance.Error(formatException);
                Response.error = Label.Get("error.schema");
                return this;
            }
            catch (Exception ex)
            {
                //An error has been caught, rollback the transaction, log the error and return a message to the caller
                Ado.RollbackTransaction();
                Log.Instance.Error(ex);
                Response.error = Label.Get("error.exception");
                return this;
            }
            finally
            {
                Dispose();
            }
        }

    }
}