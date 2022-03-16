from django.db import models
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from ngeo.apps.field_officer.models import FieldOfficer
from ngeo.apps.county_manager.models import CountyManager
from ngeo.apps.account.models import User
from ngeo.apps.finance.models import FinanceOfficer
from ngeo.apps.common.models import Area
from ngeo.apps.common.models import CommonCoreModel
# from ngeo.apps.projects.models import Project

from notifications.signals import notify
# from safedelete.models import SafeDeleteModel
from safedelete.models import SOFT_DELETE
import uuid
import logging

logger = logging.getLogger(__name__)


class Agent(CommonCoreModel):

    PERMANENT_HQ = 1
    PERMANENT_COUNTY = 2
    CONTRACT = 3

    TERMS_CHOICES = ((PERMANENT_HQ, "PERMANENT-HQ"),
                     (PERMANENT_COUNTY, "PERMANENT-COUNTY"), (CONTRACT,
                                                              "CONTRACT"))

    field_officer = models.ForeignKey(FieldOfficer,
                                      blank=True,
                                      null=True,
                                      on_delete=models.SET_NULL,
                                      related_name="agents")
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    id_number = models.CharField(max_length=200, unique=True, default=uuid.uuid4)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(blank=True, null=True, max_length=200)
    terms = models.PositiveSmallIntegerField(choices=TERMS_CHOICES, default=3)
    role = models.CharField(max_length=200, default="agent")
    area = models.ForeignKey(Area,
                             on_delete=models.SET_NULL,
                             null=True,
                             blank=True,
                             related_name="agent_area")

    finance_officer = models.ForeignKey(FinanceOfficer,
                                        blank=True,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name="agents_finance")
    reports_to = models.ForeignKey(User,
                                   blank=True,
                                   null=True,
                                   on_delete=models.SET_NULL,
                                   related_name="my_agents")

    # Reason for approval to contract/permanent terms
    # Necessary??
    contract_approved_reason = models.TextField(max_length=300,
                                                null=True,
                                                blank=True)
    permanent_approved_reason = models.TextField(max_length=300,
                                                 null=True,
                                                 blank=True)
    created_by = models.ForeignKey(User,
                                   blank=True,
                                   null=True,
                                   on_delete=models.SET_NULL,
                                   related_name="agent_creator")

    deleted_by = models.ForeignKey(User,
                                   blank=True,
                                   null=True,
                                   on_delete=models.SET_NULL,
                                   related_name="agent_deleter")
    # Reason for denial to contract/permanent terms
    contract_denied_reason = models.TextField(max_length=300,
                                              null=True,
                                              blank=True)
    permanent_denied_reason = models.TextField(max_length=300,
                                               null=True,
                                               blank=True)

    # Set to true if approved
    ## Contract
    is_approved_by_field_officer_contract = models.BooleanField(default=False)
    is_approved_by_county_manager_contract = models.BooleanField(default=False)

    delete_reason = models.TextField(max_length=1000, null=True, blank=True)

    deny_approve_delete_message = models.TextField(max_length=1000, null=True, blank=True)

    approve_delete = models.BooleanField(
        default=False,
        help_text=_(
            "Designates whether a request has been sent to delete this agent. "
            "Unselect this to show the request has been handled."),
    )

    approve_activate = models.BooleanField(
        default=False,
        help_text=_(
            "Designates whether a request has been sent to activate this agent. "
            "Unselect this to show the request has been handled."),
    )

    sender_of_delete_request = models.ForeignKey(FieldOfficer,
                                      blank=True,
                                      null=True,
                                      on_delete=models.SET_NULL,
                                      related_name="delete_sender")

    # is_approved_by_finance_contract = models.BooleanField(default=False)
    ## Permanent
    # approved_by_field_officer_permanent = models.BooleanField(default=False)
    # approved_by_county_manager_permanent = models.BooleanField(default=False)
    # approved_by_finance_permanent = models.BooleanField(default=False)


    def approve_to_contract(self,
                            user,
                            is_approved=False,
                            is_denied=False,
                            denial_reason=None,
                            sender_pk=None):
        """
        Handles agent approval to contract terms.

        args:
         - user: session user sending the request.
         - is_approved: flag indicating whether this request is approved.
         - contract_denied_reason: reason for denying this request.
         - sender_pk: ID of user who first sent the notification.
         - reason: reason for approving this request.
        """
        if user.role == User.FOO:
            # sender_pk is None here. FOO can only get feedback notification.
            # Notify county manager for my county
            field_officer = get_object_or_404(FieldOfficer, user=user)
            my_county = field_officer.area.county
            my_county_manager = CountyManager.objects.get(
                area__county=my_county)
            # CM that will receive this request.
            request_recipient = get_object_or_404(
                User, county_manager=my_county_manager)

            self.is_approved_by_field_officer_contract = True
            self.approve_activate = True # Indicates activation approval request has been sent
            is_approved = "false"
            if self.is_active:
                is_approved = "true"
            notify.send(
                # sender of notification
                field_officer,
                # recipient of notification
                recipient=request_recipient,
                # Statement describing this action
                verb=
                f"Please approve {self.first_name} {self.last_name}. Request from {field_officer.user.first_name} {field_officer.user.last_name}",
                # Notification metadata
                agent=self.id,
                agent_name=f"{self.first_name} {self.last_name}",
                field_officer=field_officer.id,
                is_approved=is_approved,
            )

            logger.critical( f"Approval request for the Agent {self.first_name} {self.last_name} successfully sent to the County Manager {request_recipient.first_name} {request_recipient.last_name} by  {field_officer.user.first_name} {field_officer.user.last_name}")

        if user.role == User.CM:
            # sender_pk needed so that CM can send feedback/reply notification.
            try:
                # Ensure agent is already approved by his/her field officer
                assert self.is_approved_by_field_officer_contract, "Approval needed by Field Outreach Officer first!"
                # Notify field officer who sent approval request
                # Current user handling FOOs request -  a CM
                county_manager = get_object_or_404(CountyManager, user=user)
                # Field officer who sent agent approval request to this CM
                field_officer = get_object_or_404(FieldOfficer, pk=sender_pk)
                feedback_recipient = get_object_or_404(
                    User, field_officer=field_officer)

                verb = ""
                if is_approved:
                    self.is_approved_by_county_manager_contract = True
                    # reset these fields to nothing
                    self.delete_reason = None
                    self.contract_denied_reason = None
                    self.activate()
                    verb = f"{self.first_name} {self.last_name} has been approved"

                    logger.critical( f"Approval request for the Agent {self.first_name} {self.last_name} approved by the County Manager {county_manager.user.first_name} {county_manager.user.last_name}. Request sent by the Field Officer: {field_officer.user.first_name} {field_officer.user.last_name}")
                if is_denied:
                    self.contract_denied_reason = denial_reason
                    verb = f"{self.first_name} {self.last_name} has been denied approval"
                    logger.critical( f"Approval request for the Agent {self.first_name} {self.last_name} denied by the County Manager {county_manager.user.first_name} {county_manager.user.last_name}. Denial Reason: {denial_reason}. Request sent by the Field Officer: {field_officer.user.first_name} {field_officer.user.last_name}")

                self.approve_activate = False # To show request has been handled. Activated by fresh approval approval
                # format to json parseable values
                approved = "false"
                denied = "false"
                if is_approved:
                    approved = "true"
                if is_denied:
                    denied = "true"

                notify.send(
                    county_manager,
                    recipient=feedback_recipient,
                    verb=verb,
                    agent=self.id,
                    denial_reason=denial_reason,
                    # format to valid json values
                    is_approved=approved,
                    is_denied=denied,
                )

            except (AssertionError, Exception) as e:
                raise

    ##################################################################
    #   Not being used for now.
    #
    ##################################################################
    def update_to_contract(self, user, reason, sender, contract_deny):
        if user.role == User.FOO:
            # Notify county manager for my county
            field_officer = get_object_or_404(FieldOfficer, user=user)
            my_county = field_officer.area.county
            my_county_manager = CountyManager.objects.get(
                area__county=my_county)
            recipient = get_object_or_404(User,
                                          county_manager=my_county_manager)

            self.approved_by_field_officer_contract = True
            self.reason_contract = reason
            notify.send(
                field_officer,
                recipient=recipient,
                verb=
                f"Please approve {self.email} to contract terms. Request from {field_officer.user.email}",
                agent=self.id,
                approval_reason=reason,
            )

        if user.role == User.CM:
            # import pdb; pdb.set_trace()
            try:
                # Ensure agent is already approved by his/her field officer
                assert self.approved_by_field_officer_contract, "Approval needed by Field Outreach Officer first!"
                # This receiver - A county manager
                county_manager = get_object_or_404(CountyManager, user=user)
                # field officer who sent request
                field_officer = get_object_or_404(FieldOfficer, pk=sender)
                recipient = get_object_or_404(User,
                                              field_officer=field_officer)

                if contract_deny:
                    notify.send(
                        county_manager,
                        recipient=recipient,
                        verb=
                        (f"Approval of  BEA: {self.first_name} {self.last_name} by "
                         f"County Manager: {county_manager.user.first_name} {county_manager.user.last_name} was "
                         "Denied!"),
                        agent=self.id,
                        denial_reason=reason,
                    )
                    return

                self.approved_by_county_manager_contract = True
                # Notify field officer who sent it for approval of his/her request
                notify.send(
                    county_manager,
                    recipient=recipient,
                    verb=
                    f"Approval of  BEA: {self.first_name} {self.last_name} to contract terms by County Manager:{county_manager.user.first_name} {county_manager.user.last_name} was successful",
                    agent=self.id,
                )

                # Propagate this request for further approval to all finance officers
                finance_officers = FinanceOfficer.objects.all()
                for finance_officer in finance_officers:
                    recipient = get_object_or_404(
                        User, finance_officer=finance_officer)
                    notify.send(
                        county_manager,
                        recipient=recipient,
                        verb=
                        f"Please approve BEA: {self.first_name} {self.last_name}. Request from County Manager:{county_manager.user.email}",
                        agent=self.id,
                        approval_reason=self.reason_contract,
                    )
            except AssertionError as e:
                raise

        if user.role == User.FINANCE:
            try:
                # Needs approval first by both CM and FOO
                assert (
                    self.approved_by_county_manager_contract
                    and self.approved_by_field_officer_contract
                ), "Approval needed by Field Outreach Officer and Count Manager first!"
                # This receiver - a finance officer
                finance_officer = get_object_or_404(FinanceOfficer, user=user)
                # county manager who sent request
                county_manager = get_object_or_404(CountyManager, pk=sender)
                recipient = get_object_or_404(User,
                                              county_manager=county_manager)

                self.approved_by_finance_contract = True
                self.terms = self.CONTRACT
                if contract_deny:
                    notify.send(
                        finance_officer,
                        recipient=recipient,
                        verb=
                        (f"Approval of  BEA: {self.email} to contract terms by "
                         f"finance officer: {finance_officer.user.email} was "
                         "Denied!"),
                        agent=self.id,
                        denial_reason=reason,
                    )
                    return

                # Send success notification to CM who issued request
                # Notify county manager who sent it for approval
                notify.send(
                    finance_officer,
                    recipient=recipient,
                    verb=(
                        f"Approval of  BEA: {self.email} to contract terms by "
                        f"finance officer: {finance_officer.user.email} was "
                        "successful"),
                    agent=self.id,
                )
            except AssertionError as e:
                # Notify of this error
                print(e)

    def update_to_permanent(self, user, reason, sender, permanent_deny):
        if user.role == User.FOO:
            # Notify my county manager
            field_officer = get_object_or_404(FieldOfficer, user=user)
            my_county = field_officer.area.county
            my_county_manager = CountyManager.objects.get(
                area__county=my_county)
            recipient = get_object_or_404(User,
                                          county_manager=my_county_manager)

            self.approved_by_field_officer_permanent = True
            self.reason_permanent = reason

            notify.send(
                field_officer,
                recipient=recipient,
                verb=
                f"Please approve BEA: {self.email} to permanent terms. Request from FOO:{field_officer.user.email}",
                agent=self.id,
                approval_reason=reason,
            )

        if user.role == User.CM:
            try:
                # Ensure agent is already approved by his/her field officer
                assert self.approved_by_field_officer_permanent, "Approval needed by Field Outreach Officer first!"
                # This receiver - A county manager
                county_manager = get_object_or_404(CountyManager, user=user)
                # field officer who sent request
                field_officer = get_object_or_404(FieldOfficer, pk=sender)
                recipient = get_object_or_404(User,
                                              field_officer=field_officer)

                if permanent_deny:
                    notify.send(
                        county_manager,
                        recipient=recipient,
                        verb=
                        (f"Approval of  BEA: {self.email} to permanent terms by "
                         f"County Manager:{county_manager.user.email} was "
                         "Denied!"),
                        agent=self.id,
                        denial_reason=reason,
                    )
                    return

                self.approved_by_county_manager_permanent = True
                # Notify field officer who sent it for approval of his/her request
                notify.send(
                    county_manager,
                    recipient=recipient,
                    verb=
                    f"Approval of  BEA: {self.email} to permanent terms by County Manager:{county_manager.user.email} was successful",
                    agent=self.id,
                )

                # Propagate this request for further approval to all finance officers
                finance_officers = FinanceOfficer.objects.all()
                for finance_officer in finance_officers:
                    recipient = get_object_or_404(
                        User, finance_officer=finance_officer)
                    notify.send(
                        county_manager,
                        recipient=recipient,
                        verb=
                        f"Please approve BEA: {self.email} to permanent terms. Request from County Manager:{county_manager.user.email}",
                        agent=self.id,
                        approval_reason=self.reason_permanent,
                    )
            except AssertionError as e:
                raise

        if user.role == User.FINANCE:
            try:
                # Needs approval first by both CM and FOO
                assert (
                    self.approved_by_county_manager_permanent
                    and self.approved_by_field_officer_permanent
                ), "Approval needed by Field Outreach Officer and Count Manager first!"
                # Send success notification to CM who issued request
                # This receiver - a finance officer
                finance_officer = get_object_or_404(FinanceOfficer, user=user)
                # county manager who sent request
                county_manager = get_object_or_404(CountyManager, pk=sender)
                recipient = get_object_or_404(User,
                                              county_manager=county_manager)

                if permanent_deny:
                    notify.send(
                        finance_officer,
                        recipient=recipient,
                        verb=
                        (f"Approval of  BEA: {self.email} to permanent terms by "
                         f"finance officer: {finance_officer.user.email} was "
                         "Denied!"),
                        agent=self.id,
                        denial_reason=reason,
                    )
                    return

                self.approved_by_finance_permanent = True
                self.terms = self.PERMANENT
                # Notify county manager who sent it for approval
                notify.send(
                    finance_officer,
                    recipient=recipient,
                    verb=(
                        f"Approval of  BEA: {self.email} to permanent terms by "
                        f"finance officer: {finance_officer.user.email} was "
                        "successful"),
                    agent=self.id,
                )
            except AssertionError as e:
                # Notify of this error
                print(e)
    
    
    def approve_agent_deletion(self, user, sender, approve_delete, delete_reason, denial_reason=None):
           
        if user.role == User.CM:
            # Approve delete request and notify the FOO OR
            # Deny delete request and notify FOO
            try:
                # Ensure delete request has been sent by the agent's FOO
                assert self.approve_agent_deletion, "Deletion request not sent!"
                # This receiver - A county manager
                county_manager = get_object_or_404(CountyManager, user=user)
                # field officer who sent request
                field_officer = get_object_or_404(FieldOfficer, pk=sender)
                # Recipient who Will recieve notification
                recipient = get_object_or_404(User,
                                              field_officer=field_officer)

                # deselect approve_delete field to show request has been handled
                self.approve_delete = False

                # Deletion is approved, so set this field to empty
                self.deny_approve_delete_message = None
                
                self.save()
                
                if approve_delete:
                    self.deleted_by = user
                    self.save()
                    # Delete agent
                    self.delete()
                    logger.critical( f"Agent {self.first_name} {self.last_name} successfully deactivated by the County Manager {county_manager.user.first_name} {county_manager.user.last_name}. Reason: {delete_reason}.")

                if not approve_delete:
                    logger.critical( f"Deactivation request for the Agent {self.first_name} {self.last_name} denied by the County Manager {county_manager.user.first_name} {county_manager.user.last_name}. Denial Reason: {denial_reason}. Request sent by the Field Officer: {field_officer.user.first_name} {field_officer.user.last_name}")
    
                # Notify field officer who sent deletion request
                message = f"Deactivation request for {self.first_name} {self.last_name} has been denied"
                if approve_delete:
                    message = f"{self.first_name} {self.last_name} has been deactivated"
                notify.send(
                    county_manager,
                    recipient=recipient,
                    verb=message,
                    agent=self.id,
                    denial_reason=denial_reason,
                    delete_reason=delete_reason
                )
            except AssertionError as e:
                raise

        if user.role == User.FOO:
            # sender_pk is None here. FOO can only get feedback notification.
            # Notify county manager for my county
            field_officer = get_object_or_404(FieldOfficer, user=user)
            my_county = field_officer.area.county
            my_county_manager = CountyManager.objects.get(
                area__county=my_county)
            # CM that will receive this request.
            request_recipient = get_object_or_404(
                User, county_manager=my_county_manager)

            self.delete_reason = delete_reason
            self.approve_delete = approve_delete
            self.sender_of_delete_request = field_officer

            logger.critical( f"Deactivation request for the Agent {self.first_name} {self.last_name} successfully sent to the County Manager {my_county_manager.user.first_name} {my_county_manager.user.last_name}. Reason: {delete_reason}. Request sent by the Field Officer: {field_officer.user.first_name} {field_officer.user.last_name}")

            # Notify the CM
            notify.send(
                # sender of notification
                field_officer,
                # recipient of notification
                recipient=request_recipient,
                # Statement describing this action
                verb=
                f"Please deactivate {self.first_name} {self.last_name}. Request from {field_officer.user.first_name} {field_officer.user.last_name}",
                # Notification metadata
                agent=self.id,
                agent_name=f"{self.first_name} {self.last_name}",
                field_officer=field_officer.id,
            )


    def delete(self):
        self.deactivate()
        # Remove this agent from projects they were assigned to.
        self.projects.clear()
        self.save()
        super(Agent, self).delete()

    def __str__(self):

        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name_plural = "agents"
